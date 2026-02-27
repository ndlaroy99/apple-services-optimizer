import { DEVICE_PROMOTIONS, PLAN_CATALOG, SERVICE_IDS, STORAGE_TIERS } from '../data/plans.js';
import { CURRENCY_SYMBOLS, FX_FROM_USD, REGION_CONFIG } from '../data/regions.js';

const OVERBUY_PENALTY_USD = 1.25;

const toCents = (amount) => Math.round(amount * 100);
const fromCents = (amount) => amount / 100;

const hasService = (plan, serviceId) => plan.includes.some((item) => item.serviceId === serviceId);

const getStorageTierIndex = (storageTier) => STORAGE_TIERS.findIndex((tier) => tier === storageTier);

const getRequiredServices = (formData) => {
  const required = new Set();

  if (formData.services.music) required.add(SERVICE_IDS.music);
  if (formData.services.tv) required.add(SERVICE_IDS.tv);
  if (formData.services.news) required.add(SERVICE_IDS.news);
  if (formData.services.fitness) required.add(SERVICE_IDS.fitness);
  if (formData.services.arcade) required.add(SERVICE_IDS.arcade);

  return {
    services: required,
    requestedStorageTier: formData.services.icloud ? formData.icloudStorage : null
  };
};

const isPlanEligible = (plan, formData) => {
  if (plan.source === 'verizon' && formData.carrier !== 'verizon') return false;
  if (plan.source === 'tmobile' && formData.carrier !== 'tmobile') return false;
  if (plan.requiresStudent && !formData.isStudent) return false;
  if (plan.familyShare < formData.familySize && formData.familySize > 1) return false;
  if (plan.deviceRequired === 'Apple Watch' && !formData.recentDevices.includes('appleWatch')) return false;

  return true;
};

const getEligiblePlans = (formData) => PLAN_CATALOG.filter((plan) => isPlanEligible(plan, formData));

const evaluateCoverage = (combo, requiredServices, requestedStorageTier) => {
  const covered = new Set();
  let maxStorageTierIndex = -1;

  for (const plan of combo) {
    for (const item of plan.includes) {
      if (item.serviceId === SERVICE_IDS.icloud) {
        maxStorageTierIndex = Math.max(maxStorageTierIndex, getStorageTierIndex(item.storageTier));
      } else {
        covered.add(item.serviceId);
      }
    }
  }

  const missingServices = [...requiredServices].filter((serviceId) => !covered.has(serviceId));

  let storageCovered = true;
  if (requestedStorageTier) {
    const requiredIndex = getStorageTierIndex(requestedStorageTier);
    storageCovered = maxStorageTierIndex >= requiredIndex;
  }

  const requestedCount = requiredServices.size + (requestedStorageTier ? 1 : 0);
  const extraServices = new Set();

  for (const plan of combo) {
    for (const item of plan.includes) {
      if (item.serviceId === SERVICE_IDS.icloud) {
        if (!requestedStorageTier) {
          extraServices.add(SERVICE_IDS.icloud);
        }
      } else if (!requiredServices.has(item.serviceId)) {
        extraServices.add(item.serviceId);
      }
    }
  }

  const coveredCount =
    requiredServices.size - missingServices.length + (requestedStorageTier && storageCovered ? 1 : 0);

  return {
    missingServices,
    storageCovered,
    coveredCount,
    requestedCount,
    overbuyCount: extraServices.size,
    coveredServices: [
      ...[...requiredServices].filter((serviceId) => covered.has(serviceId)),
      ...(requestedStorageTier && storageCovered ? [`iCloud ${requestedStorageTier}`] : [])
    ]
  };
};

const serviceLabel = (serviceId) => {
  const labels = {
    [SERVICE_IDS.music]: 'Apple Music',
    [SERVICE_IDS.tv]: 'Apple TV+',
    [SERVICE_IDS.news]: 'Apple News+',
    [SERVICE_IDS.fitness]: 'Apple Fitness+',
    [SERVICE_IDS.arcade]: 'Apple Arcade'
  };

  return labels[serviceId] || serviceId;
};

const getPromotionCreditCents = (combo, formData) => {
  const comboServices = new Set();
  combo.forEach((plan) => {
    plan.includes.forEach((item) => comboServices.add(item.serviceId));
  });

  let creditCents = 0;

  formData.recentDevices.forEach((device) => {
    const promo = DEVICE_PROMOTIONS[device];
    if (!promo || !comboServices.has(promo.serviceId)) {
      return;
    }

    const cheapestPlan = combo
      .filter((plan) => hasService(plan, promo.serviceId))
      .reduce((cheapest, current) => {
        if (!cheapest) return current;
        return current.price.monthly < cheapest.price.monthly ? current : cheapest;
      }, null);

    if (!cheapestPlan) {
      return;
    }

    creditCents += toCents(cheapestPlan.price.monthly * promo.monthsFree);
  });

  return creditCents;
};

const summarizePromotions = (combo, formData) => {
  const comboServices = new Set();
  combo.forEach((plan) => {
    plan.includes.forEach((item) => comboServices.add(item.serviceId));
  });

  const promos = [];
  formData.recentDevices.forEach((device) => {
    const promo = DEVICE_PROMOTIONS[device];
    if (promo && comboServices.has(promo.serviceId)) {
      promos.push(`${promo.monthsFree} months free ${serviceLabel(promo.serviceId)}`);
    }
  });

  return [...new Set(promos)];
};

const applyCorporateDiscountCents = (combo, formData) => {
  if (!formData.hasCorporateDiscount) {
    return 0;
  }

  // This is configurable and intentionally conservative.
  const discountRate = 0.05;
  const appleSubtotalCents = combo
    .filter((plan) => plan.source === 'apple')
    .reduce((sum, plan) => sum + toCents(plan.price.monthly), 0);

  return Math.round(appleSubtotalCents * discountRate);
};

const computeTaxBreakdownCents = (subtotalCents, country) => {
  const region = REGION_CONFIG[country] || REGION_CONFIG.US;

  if (region.taxMode === 'inclusive') {
    const preTax = Math.round(subtotalCents / (1 + region.taxRate));
    const tax = subtotalCents - preTax;
    return {
      preTaxCents: preTax,
      taxCents: tax,
      totalWithTaxCents: subtotalCents,
      taxRate: region.taxRate,
      taxMode: region.taxMode
    };
  }

  const tax = Math.round(subtotalCents * region.taxRate);
  return {
    preTaxCents: subtotalCents,
    taxCents: tax,
    totalWithTaxCents: subtotalCents + tax,
    taxRate: region.taxRate,
    taxMode: region.taxMode
  };
};

const rankCandidates = (candidates) => {
  return candidates
    .map((candidate) => ({
      ...candidate,
      scoreCents:
        candidate.totalWithTaxCents +
        Math.round(candidate.overbuyCount * OVERBUY_PENALTY_USD * 100) +
        candidate.eligibilityPenaltyCents
    }))
    .sort((a, b) => {
      if (a.scoreCents !== b.scoreCents) {
        return a.scoreCents - b.scoreCents;
      }
      if (a.overbuyCount !== b.overbuyCount) {
        return a.overbuyCount - b.overbuyCount;
      }
      return a.totalWithTaxCents - b.totalWithTaxCents;
    });
};

const getComboName = (combo) => {
  if (combo.length === 1) {
    return combo[0].name;
  }

  const bundle = combo.find((plan) => plan.bundle);
  if (bundle) {
    return `${bundle.name} + Add-ons`;
  }

  return combo.length > 1 ? 'Mixed Individual Plan' : 'Individual Services';
};

export const getDynamicComponentLimit = (requiredServiceCount, hasStorageRequest, relevantPlanCount) => {
  const requestedUnits = requiredServiceCount + (hasStorageRequest ? 1 : 0);
  if (requestedUnits === 0) {
    return 0;
  }

  return Math.min(requestedUnits, relevantPlanCount);
};

const planAddsRequestedCoverage = (
  plan,
  coveredServices,
  currentStorageIndex,
  requiredServices,
  requestedStorageTier
) => {
  const addsRequiredService = plan.includes.some(
    (item) => item.serviceId !== SERVICE_IDS.icloud && requiredServices.has(item.serviceId) && !coveredServices.has(item.serviceId)
  );

  if (addsRequiredService) {
    return true;
  }

  if (!requestedStorageTier) {
    return false;
  }

  const requiredStorageIndex = getStorageTierIndex(requestedStorageTier);
  const nextStorageIndex = plan.includes
    .filter((item) => item.serviceId === SERVICE_IDS.icloud)
    .reduce((max, item) => Math.max(max, getStorageTierIndex(item.storageTier)), currentStorageIndex);

  return nextStorageIndex > currentStorageIndex && currentStorageIndex < requiredStorageIndex;
};

const normalizeCurrency = (country, currency) => {
  const region = REGION_CONFIG[country] || REGION_CONFIG.US;
  return currency || region.defaultCurrency;
};

export const convertUsd = (amountUSD, currency) => {
  const rate = FX_FROM_USD[currency] || 1;
  return amountUSD * rate;
};

export const formatCurrency = (amountUSD, currency) => {
  const normalizedCurrency = currency || 'USD';
  const symbol = CURRENCY_SYMBOLS[normalizedCurrency] || '$';
  const converted = convertUsd(amountUSD, normalizedCurrency);

  return `${symbol}${converted.toFixed(2)}`;
};

export const buildRecommendations = (formData) => {
  const { services: requiredServices, requestedStorageTier } = getRequiredServices(formData);
  const eligiblePlans = getEligiblePlans(formData);

  if (requiredServices.size === 0 && !requestedStorageTier) {
    return [];
  }

  const relevantPlans = eligiblePlans.filter((plan) =>
    plan.includes.some((item) =>
      item.serviceId === SERVICE_IDS.icloud ? !!requestedStorageTier : requiredServices.has(item.serviceId)
    )
  );

  const dynamicLimit = getDynamicComponentLimit(
    requiredServices.size,
    Boolean(requestedStorageTier),
    relevantPlans.length
  );

  if (dynamicLimit === 0) {
    return [];
  }

  const candidateCombos = [];

  const dfs = (startIndex, chosen, coveredServices, currentStorageIndex) => {
    if (chosen.length > 0) {
      candidateCombos.push([...chosen]);
    }

    if (chosen.length >= dynamicLimit) {
      return;
    }

    for (let i = startIndex; i < relevantPlans.length; i += 1) {
      const plan = relevantPlans[i];
      if (
        !planAddsRequestedCoverage(
          plan,
          coveredServices,
          currentStorageIndex,
          requiredServices,
          requestedStorageTier
        )
      ) {
        continue;
      }

      const nextCovered = new Set(coveredServices);
      let nextStorageIndex = currentStorageIndex;

      plan.includes.forEach((item) => {
        if (item.serviceId === SERVICE_IDS.icloud) {
          nextStorageIndex = Math.max(nextStorageIndex, getStorageTierIndex(item.storageTier));
          return;
        }

        if (requiredServices.has(item.serviceId)) {
          nextCovered.add(item.serviceId);
        }
      });

      chosen.push(plan);
      dfs(i + 1, chosen, nextCovered, nextStorageIndex);
      chosen.pop();
    }
  };

  dfs(0, [], new Set(), -1);

  const scored = [];

  candidateCombos.forEach((combo) => {
    const coverage = evaluateCoverage(combo, requiredServices, requestedStorageTier);
    if (coverage.missingServices.length > 0 || !coverage.storageCovered) {
      return;
    }

    const monthlySubtotalCents = combo.reduce((sum, plan) => sum + toCents(plan.price.monthly), 0);
    const corporateDiscountCents = applyCorporateDiscountCents(combo, formData);
    const discountedSubtotalCents = Math.max(0, monthlySubtotalCents - corporateDiscountCents);

    const tax = computeTaxBreakdownCents(discountedSubtotalCents, formData.country);
    const promoCreditCents = getPromotionCreditCents(combo, formData);
    const yearlyCostWithTaxCents = tax.totalWithTaxCents * 12;
    const firstYearEffectiveCents = Math.max(0, yearlyCostWithTaxCents - promoCreditCents);

    const missingPrereqCount = combo.filter((plan) => Boolean(plan.prerequisite)).length;

    scored.push({
      name: getComboName(combo),
      components: combo,
      type: combo.some((plan) => plan.bundle) ? 'bundle' : 'mixed',
      coveredServices: coverage.coveredServices,
      overbuyCount: coverage.overbuyCount,
      overbuyLabel:
        coverage.overbuyCount === 0
          ? 'No paid extras'
          : `${coverage.overbuyCount} extra paid service${coverage.overbuyCount > 1 ? 's' : ''}`,
      prerequisiteWarnings: combo
        .filter((plan) => Boolean(plan.prerequisite))
        .map((plan) => `${plan.name}: ${plan.prerequisite}`),
      eligibilityPenaltyCents: missingPrereqCount * 25,
      subtotalCents: discountedSubtotalCents,
      corporateDiscountCents,
      preTaxCents: tax.preTaxCents,
      taxCents: tax.taxCents,
      totalWithTaxCents: tax.totalWithTaxCents,
      firstYearEffectiveMonthlyCents: Math.round(firstYearEffectiveCents / 12),
      promotions: summarizePromotions(combo, formData),
      taxRate: tax.taxRate,
      taxMode: tax.taxMode
    });
  });

  const ranked = rankCandidates(scored).slice(0, 5);
  const currency = normalizeCurrency(formData.country, formData.currency);

  return ranked.map((result) => ({
    ...result,
    currency,
    subtotal: convertUsd(fromCents(result.subtotalCents), currency),
    preTax: convertUsd(fromCents(result.preTaxCents), currency),
    tax: convertUsd(fromCents(result.taxCents), currency),
    totalWithTax: convertUsd(fromCents(result.totalWithTaxCents), currency),
    firstYearEffectiveMonthly: convertUsd(fromCents(result.firstYearEffectiveMonthlyCents), currency),
    corporateDiscount: convertUsd(fromCents(result.corporateDiscountCents), currency)
  }));
};

export const getDefaultCurrencyForCountry = (country) => {
  const region = REGION_CONFIG[country] || REGION_CONFIG.US;
  return region.defaultCurrency;
};

export const getRegionTax = (country) => {
  const region = REGION_CONFIG[country] || REGION_CONFIG.US;
  return {
    rate: region.taxRate,
    mode: region.taxMode
  };
};
