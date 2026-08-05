import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRecommendations,
  getDefaultCurrencyForCountry,
  getDynamicComponentLimit,
  getRegionTax
} from './optimizer.js';

const baseFormData = {
  services: {
    music: false,
    tv: false,
    news: false,
    fitness: false,
    arcade: false,
    icloud: false
  },
  icloudStorage: '50GB',
  familySize: 1,
  carrier: 'none',
  isStudent: false,
  recentDevices: [],
  hasCorporateDiscount: false,
  country: 'US',
  currency: 'USD',
  currentSubscriptions: []
};

const withServices = (services, overrides = {}) => ({
  ...baseFormData,
  ...overrides,
  services: {
    ...baseFormData.services,
    ...services
  }
});

test('dynamic component limit scales with requested coverage', () => {
  assert.equal(getDynamicComponentLimit(0, false, 10), 0);
  assert.equal(getDynamicComponentLimit(1, false, 10), 1);
  assert.equal(getDynamicComponentLimit(5, true, 20), 6);
  assert.equal(getDynamicComponentLimit(5, true, 3), 3);
});

test('single-service request avoids overkill bundle', () => {
  const recommendations = buildRecommendations(withServices({ music: true }));

  assert.ok(recommendations.length > 0);
  assert.equal(recommendations[0].name, 'Apple Music Individual');
  assert.equal(recommendations[0].overbuyCount, 0);
});

test('inclusive tax regions keep subtotal equal to total with tax', () => {
  const recommendations = buildRecommendations(
    withServices({ music: true, tv: true }, { country: 'EU', currency: 'EUR' })
  );

  assert.ok(recommendations.length > 0);
  assert.equal(recommendations[0].taxMode, 'inclusive');
  assert.equal(recommendations[0].totalWithTax, recommendations[0].subtotal);
  assert.ok(recommendations[0].tax > 0);
});

test('corporate discount lowers recommendation total', () => {
  const withoutDiscount = buildRecommendations(withServices({ music: true, tv: true }))[0];
  const withDiscount = buildRecommendations(
    withServices({ music: true, tv: true }, { hasCorporateDiscount: true })
  )[0];

  assert.ok(withoutDiscount);
  assert.ok(withDiscount);
  assert.ok(withoutDiscount.totalWithTax > withDiscount.totalWithTax);
  assert.ok(withDiscount.corporateDiscount > 0);
});

test('country helpers return expected defaults', () => {
  const usTax = getRegionTax('US');
  const euTax = getRegionTax('EU');

  assert.equal(getDefaultCurrencyForCountry('US'), 'USD');
  assert.equal(getDefaultCurrencyForCountry('EU'), 'EUR');
  assert.equal(usTax.mode, 'exclusive');
  assert.equal(euTax.mode, 'inclusive');
});

test('six-member family still gets family-plan recommendations', () => {
  const recommendations = buildRecommendations(
    withServices({ music: true, tv: true, arcade: true }, { familySize: 6 })
  );

  assert.ok(recommendations.length > 0);
  assert.equal(recommendations[0].name, 'Apple One Family');
});

test('fitness without an Apple Watch is flagged as a prerequisite', () => {
  const recommendations = buildRecommendations(withServices({ fitness: true }));

  assert.ok(recommendations.length > 0);
  assert.ok(
    recommendations[0].prerequisiteWarnings.some((warning) =>
      warning.includes('Apple Fitness+ requires an Apple Watch')
    )
  );
});

test('fitness with an Apple Watch carries no fitness prerequisite warning', () => {
  const recommendations = buildRecommendations(
    withServices({ fitness: true }, { recentDevices: ['appleWatch'] })
  );

  assert.ok(recommendations.length > 0);
  assert.ok(
    recommendations.some((r) => r.components.some((p) => p.id === 'fitness-annual'))
  );
  assert.ok(
    recommendations.every((r) =>
      r.prerequisiteWarnings.every(
        (warning) => !warning.includes('Apple Fitness+ requires an Apple Watch')
      )
    )
  );
});

test('promotion credit does not use full bundle price for a single service', () => {
  const recommendations = buildRecommendations(
    withServices(
      { music: true, tv: true, arcade: true },
      { recentDevices: ['iphone'] }
    )
  );

  assert.ok(recommendations.length > 0);
  assert.equal(recommendations[0].name, 'Apple One Individual');
  assert.equal(recommendations[0].firstYearEffectiveMonthly, 19.49);
});

test('multiple devices granting the same promotion do not stack credit', () => {
  const singleDevice = buildRecommendations(
    withServices({ tv: true }, { recentDevices: ['iphone'] })
  )[0];
  const threeDevices = buildRecommendations(
    withServices({ tv: true }, { recentDevices: ['iphone', 'ipad', 'mac'] })
  )[0];

  assert.ok(singleDevice);
  assert.ok(threeDevices);
  assert.equal(
    threeDevices.firstYearEffectiveMonthly,
    singleDevice.firstYearEffectiveMonthly
  );
  assert.equal(threeDevices.firstYearEffectiveMonthly, 6.85);
});
