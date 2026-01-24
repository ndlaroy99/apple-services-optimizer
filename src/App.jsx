import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, DollarSign, Users, MapPin, Check, AlertCircle, Share2, Save } from 'lucide-react';

const AppleServicesOptimizer = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
  });

  const [results, setResults] = useState(null);

  // Data structures based on the PDF
  const serviceData = {
    appleOneIndividual: {
      name: 'Apple One Individual',
      services: ['iCloud 50GB', 'Apple Music', 'Apple TV+', 'Apple Arcade'],
      price: 19.95,
      familyShare: 1,
      source: 'apple'
    },
    appleOneFamily: {
      name: 'Apple One Family',
      services: ['iCloud 200GB', 'Apple Music', 'Apple TV+', 'Apple Arcade'],
      price: 25.95,
      familyShare: 5,
      source: 'apple'
    },
    appleOnePremier: {
      name: 'Apple One Premier',
      services: ['iCloud 2TB', 'Apple Music', 'Apple TV+', 'Apple Arcade', 'Apple News+', 'Apple Fitness+'],
      price: 37.95,
      familyShare: 5,
      source: 'apple'
    },
    appleOneIndividualVerizon: {
      name: 'Apple One Individual (Verizon)',
      services: ['iCloud 50GB', 'Apple Music', 'Apple TV+', 'Apple Arcade'],
      price: 15.00,
      familyShare: 1,
      source: 'verizon',
      prerequisite: 'Requires myPlan'
    },
    appleOneFamilyVerizon: {
      name: 'Apple One Family (Verizon)',
      services: ['iCloud 200GB', 'Apple Music', 'Apple TV+', 'Apple Arcade'],
      price: 20.00,
      familyShare: 5,
      source: 'verizon',
      prerequisite: 'Requires myPlan'
    },
    musicStudent: {
      name: 'Apple Music Student',
      services: ['Apple Music', 'Apple TV+'],
      price: 5.99,
      familyShare: 1,
      source: 'apple',
      prerequisite: 'Student verification required'
    },
    musicIndividual: {
      name: 'Apple Music Individual',
      services: ['Apple Music'],
      price: 10.99,
      familyShare: 1,
      source: 'apple'
    },
    musicFamily: {
      name: 'Apple Music Family',
      services: ['Apple Music'],
      price: 16.99,
      familyShare: 5,
      source: 'apple'
    },
    musicIndividualVerizon: {
      name: 'Apple Music Individual (Verizon)',
      services: ['Apple Music'],
      price: 10.99,
      familyShare: 1,
      source: 'verizon',
      prerequisite: 'Requires 5G Get More'
    },
    musicFamilyVerizon: {
      name: 'Apple Music Family (Verizon)',
      services: ['Apple Music'],
      price: 10.00,
      familyShare: 5,
      source: 'verizon',
      prerequisite: 'Requires myPlan'
    },
    tvMonthly: {
      name: 'Apple TV+',
      services: ['Apple TV+'],
      price: 12.99,
      familyShare: 5,
      source: 'apple'
    },
    tvAnnual: {
      name: 'Apple TV+ (Annual)',
      services: ['Apple TV+'],
      price: 99.00 / 12,
      familyShare: 5,
      source: 'apple',
      billingPeriod: 'annual'
    },
    tvTMobile: {
      name: 'Apple TV+ (T-Mobile)',
      services: ['Apple TV+'],
      price: 3.00,
      familyShare: 5,
      source: 'tmobile',
      prerequisite: 'Requires Better Value or Experience Beyond plan'
    },
    newsPlus: {
      name: 'Apple News+',
      services: ['Apple News+'],
      price: 12.99,
      familyShare: 5,
      source: 'apple'
    },
    fitnessMonthly: {
      name: 'Apple Fitness+',
      services: ['Apple Fitness+'],
      price: 9.99,
      familyShare: 5,
      source: 'apple',
      deviceRequired: 'Apple Watch'
    },
    fitnessAnnual: {
      name: 'Apple Fitness+ (Annual)',
      services: ['Apple Fitness+'],
      price: 79.99 / 12,
      familyShare: 5,
      source: 'apple',
      billingPeriod: 'annual',
      deviceRequired: 'Apple Watch'
    },
    arcade: {
      name: 'Apple Arcade',
      services: ['Apple Arcade'],
      price: 6.99,
      familyShare: 5,
      source: 'apple'
    },
    icloud50: {
      name: 'iCloud+ 50GB',
      services: ['iCloud 50GB'],
      price: 0.99,
      familyShare: 5,
      source: 'apple'
    },
    icloud200: {
      name: 'iCloud+ 200GB',
      services: ['iCloud 200GB'],
      price: 2.99,
      familyShare: 5,
      source: 'apple'
    },
    icloud2tb: {
      name: 'iCloud+ 2TB',
      services: ['iCloud 2TB'],
      price: 9.99,
      familyShare: 5,
      source: 'apple'
    },
    icloud6tb: {
      name: 'iCloud+ 6TB',
      services: ['iCloud 6TB'],
      price: 29.99,
      familyShare: 5,
      source: 'apple'
    },
    icloud12tb: {
      name: 'iCloud+ 12TB',
      services: ['iCloud 12TB'],
      price: 59.99,
      familyShare: 5,
      source: 'apple'
    }
  };

  const taxRates = {
    US: 0.08,
    CA: 0.13,
    AU: 0.10,
    EU: 0.20,
    GB: 0.20,
    IN: 0.18,
    MX: 0.16,
    JP: 0.10,
    CN: 0.13
  };

  const currencySymbols = {
    USD: '$',
    CAD: 'C$',
    AUD: 'A$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    MXN: 'MX$',
    JPY: '¥',
    CNY: '¥'
  };

  const devicePromotions = {
    iphone: { service: 'Apple TV+', months: 3 },
    ipad: { service: 'Apple TV+', months: 3 },
    mac: { service: 'Apple TV+', months: 3 },
    appleWatch: { service: 'Apple Fitness+', months: 3 }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service]
      }
    }));
  };

  const calculateOptimalPlans = () => {
    const wantedServices = [];
    if (formData.services.music) wantedServices.push('Apple Music');
    if (formData.services.tv) wantedServices.push('Apple TV+');
    if (formData.services.news) wantedServices.push('Apple News+');
    if (formData.services.fitness) wantedServices.push('Apple Fitness+');
    if (formData.services.arcade) wantedServices.push('Apple Arcade');
    if (formData.services.icloud) wantedServices.push(`iCloud ${formData.icloudStorage}`);

    const plans = [];

    // Check eligibility for each plan
    Object.entries(serviceData).forEach(([key, plan]) => {
      let eligible = true;
      let reasons = [];

      // Check carrier eligibility
      if (plan.source === 'verizon' && formData.carrier !== 'verizon') {
        eligible = false;
      }
      if (plan.source === 'tmobile' && formData.carrier !== 'tmobile') {
        eligible = false;
      }

      // Check student eligibility
      if (key === 'musicStudent' && !formData.isStudent) {
        eligible = false;
      }

      // Check family size compatibility
      if (plan.familyShare < formData.familySize && formData.familySize > 1) {
        eligible = false;
        reasons.push(`Only supports ${plan.familyShare} user(s), you need ${formData.familySize}`);
      }

      // Check device requirements
      if (plan.deviceRequired === 'Apple Watch' && !formData.recentDevices.includes('appleWatch')) {
        reasons.push('Requires Apple Watch');
      }

      if (eligible) {
        plans.push({ key, ...plan, reasons });
      }
    });

    // Generate combinations
    const combinations = [];

    // Try each Apple One bundle first
    const appleOneBundles = plans.filter(p => p.name.includes('Apple One'));
    appleOneBundles.forEach(bundle => {
      const bundleServices = bundle.services;
      const coveredServices = wantedServices.filter(ws => {
        return bundleServices.some(bs => {
          if (ws.startsWith('iCloud')) {
            const wantedSize = ws.replace('iCloud ', '');
            const bundleSize = bs.replace('iCloud ', '');
            return compareStorage(bundleSize, wantedSize) >= 0;
          }
          return bs.includes(ws);
        });
      });

      const uncoveredServices = wantedServices.filter(ws => !coveredServices.includes(ws));
      
      let totalCost = bundle.price;
      const components = [{ ...bundle }];

      // Add missing services
      uncoveredServices.forEach(service => {
        if (service.startsWith('iCloud')) {
          const neededStorage = service.replace('iCloud ', '');
          const bundleStorage = bundleServices.find(s => s.startsWith('iCloud'))?.replace('iCloud ', '') || '0GB';
          
          if (compareStorage(neededStorage, bundleStorage) > 0) {
            const additionalStorage = getAdditionalStorage(bundleStorage, neededStorage);
            if (additionalStorage) {
              const storagePlan = plans.find(p => p.services.includes(`iCloud ${additionalStorage}`));
              if (storagePlan) {
                totalCost += storagePlan.price;
                components.push(storagePlan);
              }
            }
          }
        } else if (service === 'Apple Music') {
          const musicPlan = plans.find(p => p.name.includes('Music') && p.familyShare >= formData.familySize);
          if (musicPlan) {
            totalCost += musicPlan.price;
            components.push(musicPlan);
          }
        } else if (service === 'Apple TV+') {
          const tvPlan = plans.find(p => p.name === 'Apple TV+');
          if (tvPlan) {
            totalCost += tvPlan.price;
            components.push(tvPlan);
          }
        } else if (service === 'Apple News+') {
          const newsPlan = plans.find(p => p.name === 'Apple News+');
          if (newsPlan) {
            totalCost += newsPlan.price;
            components.push(newsPlan);
          }
        } else if (service === 'Apple Fitness+') {
          const fitnessPlan = plans.find(p => p.name === 'Apple Fitness+');
          if (fitnessPlan) {
            totalCost += fitnessPlan.price;
            components.push(fitnessPlan);
          }
        } else if (service === 'Apple Arcade') {
          const arcadePlan = plans.find(p => p.name === 'Apple Arcade');
          if (arcadePlan) {
            totalCost += arcadePlan.price;
            components.push(arcadePlan);
          }
        }
      });

      combinations.push({
        name: `${bundle.name} + Add-ons`,
        components,
        totalCost,
        coveredServices: [...new Set([...coveredServices, ...uncoveredServices])],
        type: 'bundle'
      });
    });

    // Try individual services only
    let individualCost = 0;
    const individualComponents = [];

    wantedServices.forEach(service => {
      if (service.startsWith('iCloud')) {
        const storage = service.replace('iCloud ', '');
        const storagePlan = plans.find(p => p.services.includes(service) && p.source === 'apple');
        if (storagePlan) {
          individualCost += storagePlan.price;
          individualComponents.push(storagePlan);
        }
      } else if (service === 'Apple Music') {
        const musicPlan = formData.isStudent 
          ? plans.find(p => p.name === 'Apple Music Student')
          : formData.familySize > 1
            ? plans.find(p => p.name === 'Apple Music Family')
            : plans.find(p => p.name === 'Apple Music Individual');
        if (musicPlan) {
          individualCost += musicPlan.price;
          individualComponents.push(musicPlan);
        }
      } else if (service === 'Apple TV+') {
        const tvPlan = plans.find(p => p.name === 'Apple TV+ (Annual)') || plans.find(p => p.name === 'Apple TV+');
        if (tvPlan) {
          individualCost += tvPlan.price;
          individualComponents.push(tvPlan);
        }
      } else if (service === 'Apple News+') {
        const newsPlan = plans.find(p => p.name === 'Apple News+');
        if (newsPlan) {
          individualCost += newsPlan.price;
          individualComponents.push(newsPlan);
        }
      } else if (service === 'Apple Fitness+') {
        const fitnessPlan = plans.find(p => p.name === 'Apple Fitness+ (Annual)') || plans.find(p => p.name === 'Apple Fitness+');
        if (fitnessPlan) {
          individualCost += fitnessPlan.price;
          individualComponents.push(fitnessPlan);
        }
      } else if (service === 'Apple Arcade') {
        const arcadePlan = plans.find(p => p.name === 'Apple Arcade');
        if (arcadePlan) {
          individualCost += arcadePlan.price;
          individualComponents.push(arcadePlan);
        }
      }
    });

    if (individualComponents.length > 0) {
      combinations.push({
        name: 'Individual Services',
        components: individualComponents,
        totalCost: individualCost,
        coveredServices: wantedServices,
        type: 'individual'
      });
    }

    // Apply promotions
    formData.recentDevices.forEach(device => {
      const promo = devicePromotions[device];
      if (promo) {
        combinations.forEach(combo => {
          combo.promotions = combo.promotions || [];
          combo.promotions.push(`${promo.months} months free ${promo.service}`);
        });
      }
    });

    // Apply taxes
    const taxRate = taxRates[formData.country] || 0;
    combinations.forEach(combo => {
      combo.subtotal = combo.totalCost;
      combo.tax = combo.totalCost * taxRate;
      combo.totalWithTax = combo.totalCost + combo.tax;
    });

    // Sort by total cost
    combinations.sort((a, b) => a.totalWithTax - b.totalWithTax);

    return combinations.slice(0, 5);
  };

  const compareStorage = (storage1, storage2) => {
    const getValue = (str) => {
      if (str.includes('TB')) return parseFloat(str) * 1024;
      return parseFloat(str);
    };
    return getValue(storage1) - getValue(storage2);
  };

  const getAdditionalStorage = (current, needed) => {
    const storageOptions = ['50GB', '200GB', '2TB', '6TB', '12TB'];
    const currentIndex = storageOptions.findIndex(s => s === current);
    const neededIndex = storageOptions.findIndex(s => s === needed);
    
    if (neededIndex > currentIndex) {
      return storageOptions[neededIndex];
    }
    return null;
  };

  const handleCalculate = () => {
    const optimal = calculateOptimalPlans();
    setResults(optimal);
    setStep(6);
  };

  const formatCurrency = (amount) => {
    const symbol = currencySymbols[formData.currency];
    return `${symbol}${amount.toFixed(2)}`;
  };

  const saveResults = () => {
    const resultsData = {
      timestamp: new Date().toISOString(),
      formData,
      results
    };
    localStorage.setItem('appleServicesResults', JSON.stringify(resultsData));
    alert('Results saved successfully!');
  };

  const shareResults = () => {
    if (!results || results.length === 0) return;
    
    const bestOption = results[0];
    const shareText = `Apple Services Optimizer Results:
Best Option: ${bestOption.name}
Monthly Cost: ${formatCurrency(bestOption.totalWithTax)}
Services: ${bestOption.coveredServices.join(', ')}`;
    
    navigator.clipboard.writeText(shareText);
    alert('Results copied to clipboard!');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Which Apple services do you want?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'music', label: 'Apple Music', desc: 'Stream millions of songs' },
          { key: 'tv', label: 'Apple TV+', desc: 'Original shows and movies' },
          { key: 'news', label: 'Apple News+', desc: 'Magazines and newspapers' },
          { key: 'fitness', label: 'Apple Fitness+', desc: 'Workout videos (requires Apple Watch)' },
          { key: 'arcade', label: 'Apple Arcade', desc: 'Gaming subscription' },
          { key: 'icloud', label: 'iCloud+', desc: 'Cloud storage' }
        ].map(service => (
          <div
            key={service.key}
            onClick={() => toggleService(service.key)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.services[service.key]
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{service.label}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
              {formData.services[service.key] && (
                <Check className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {formData.services.icloud && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How much iCloud storage do you need?
          </label>
          <select
            value={formData.icloudStorage}
            onChange={(e) => updateFormData('icloudStorage', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="50GB">50GB</option>
            <option value="200GB">200GB</option>
            <option value="2TB">2TB</option>
            <option value="6TB">6TB</option>
            <option value="12TB">12TB</option>
          </select>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Family & Sharing</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How many people in your Apple Family?
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => updateFormData('familySize', num)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                formData.familySize === num
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          <Users className="inline w-4 h-4 mr-1" />
          Apple Family Sharing allows up to 6 people to share subscriptions
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Eligibility & Discounts</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Carrier
        </label>
        <select
          value={formData.carrier}
          onChange={(e) => updateFormData('carrier', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="none">No carrier discount</option>
          <option value="verizon">Verizon</option>
          <option value="tmobile">T-Mobile</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="student"
          checked={formData.isStudent}
          onChange={(e) => updateFormData('isStudent', e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="student" className="text-sm font-medium text-gray-700">
          I'm a student (eligible for student discount)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recently purchased Apple devices?
        </label>
        <div className="space-y-2">
          {[
            { key: 'iphone', label: 'iPhone (3 months free Apple TV+)' },
            { key: 'ipad', label: 'iPad (3 months free Apple TV+)' },
            { key: 'mac', label: 'Mac (3 months free Apple TV+)' },
            { key: 'appleWatch', label: 'Apple Watch (3 months free Fitness+)' }
          ].map(device => (
            <div key={device.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={device.key}
                checked={formData.recentDevices.includes(device.key)}
                onChange={(e) => {
                  const newDevices = e.target.checked
                    ? [...formData.recentDevices, device.key]
                    : formData.recentDevices.filter(d => d !== device.key);
                  updateFormData('recentDevices', newDevices);
                }}
                className="w-4 h-4"
              />
              <label htmlFor={device.key} className="text-sm text-gray-700">
                {device.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="corporate"
          checked={formData.hasCorporateDiscount}
          onChange={(e) => updateFormData('hasCorporateDiscount', e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="corporate" className="text-sm font-medium text-gray-700">
          I have a corporate/business discount
        </label>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Location & Currency</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country/Region
        </label>
        <select
          value={formData.country}
          onChange={(e) => updateFormData('country', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="EU">European Union</option>
          <option value="GB">United Kingdom</option>
          <option value="IN">India</option>
          <option value="MX">Mexico</option>
          <option value="JP">Japan</option>
          <option value="CN">China</option>
        </select>
        <p className="mt-1 text-sm text-gray-600">
          Tax rate: {(taxRates[formData.country] * 100).toFixed(0)}%
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <select
          value={formData.currency}
          onChange={(e) => updateFormData('currency', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="USD">USD - US Dollar</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="AUD">AUD - Australian Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="INR">INR - Indian Rupee</option>
          <option value="MXN">MXN - Mexican Peso</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="CNY">CNY - Chinese Yuan</option>
        </select>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Current Subscriptions (Optional)</h2>
      <p className="text-gray-600">
        Tell us what you currently pay to see how much you could save.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <AlertCircle className="inline w-5 h-5 text-blue-600 mr-2" />
        <span className="text-sm text-blue-800">
          This step is optional. Skip if you want to see recommendations only.
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Service name (e.g., Apple Music)"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Price"
            className="w-24 p-2 border border-gray-300 rounded-lg"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Add
          </button>
        </div>
      </div>

      {formData.currentSubscriptions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Your Current Setup:</h3>
          {formData.currentSubscriptions.map((sub, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>{sub.name}</span>
              <span className="font-medium">{formatCurrency(sub.price)}/mo</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    if (!results || results.length === 0) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">No suitable plans found. Please adjust your selections.</p>
        </div>
      );
    }

    const bestOption = results[0];
    const currentTotal = formData.currentSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const monthlySavings = currentTotal > 0 ? currentTotal - bestOption.totalWithTax : 0;
    const annualSavings = monthlySavings * 12;

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-800">Your Optimal Plan</h2>
          <div className="flex gap-2">
            <button
              onClick={saveResults}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={shareResults}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Best Option Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full mb-2">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{bestOption.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(bestOption.totalWithTax)}
              </div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(bestOption.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({(taxRates[formData.country] * 100).toFixed(0)}%):</span>
              <span className="font-medium">{formatCurrency(bestOption.tax)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Monthly:</span>
              <span className="text-blue-600">{formatCurrency(bestOption.totalWithTax)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">What's Included:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {bestOption.components.map((comp, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-800">{comp.name}</div>
                    {comp.billingPeriod === 'annual' && (
                      <div className="text-xs text-gray-500">Billed annually</div>
                    )}
                    {comp.prerequisite && (
                      <div className="text-xs text-orange-600">{comp.prerequisite}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {bestOption.promotions && bestOption.promotions.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="font-semibold text-green-800 mb-1">Available Promotions:</div>
              {bestOption.promotions.map((promo, idx) => (
                <div key={idx} className="text-sm text-green-700">• {promo}</div>
              ))}
            </div>
          )}

          {currentTotal > 0 && (
            <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Your Savings</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-700">Monthly Savings</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(monthlySavings)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-green-700">Annual Savings</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(annualSavings)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Why This Plan?</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {bestOption.type === 'bundle' ? (
                <>
                  <li>• Bundles multiple services at a discounted rate</li>
                  <li>• Covers {bestOption.coveredServices.length} of your requested services</li>
                  {formData.familySize > 1 && (
                    <li>• Can be shared with up to {bestOption.components[0].familyShare} family members</li>
                  )}
                </>
              ) : (
                <>
                  <li>• Individual services give you maximum flexibility</li>
                  <li>• Pay only for exactly what you need</li>
                  <li>• No bundled services you won't use</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Alternative Options */}
        {results.length > 1 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Alternative Options</h3>
            <div className="space-y-4">
              {results.slice(1).map((option, idx) => (
                <div key={idx} className="border border-gray-300 rounded-lg p-5 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{option.name}</h4>
                      <p className="text-sm text-gray-600">
                        {option.components.length} component{option.components.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {formatCurrency(option.totalWithTax)}
                      </div>
                      <div className="text-xs text-gray-600">per month</div>
                      <div className="text-sm text-orange-600 mt-1">
                        +{formatCurrency(option.totalWithTax - bestOption.totalWithTax)} vs best
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Includes:</div>
                    <div className="flex flex-wrap gap-2">
                      {option.components.map((comp, compIdx) => (
                        <span
                          key={compIdx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {comp.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {option.type === 'bundle' && (
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Pros:</strong> Bundled discount, simplified billing
                    </div>
                  )}
                  {option.type === 'individual' && (
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Pros:</strong> Maximum flexibility, no unused services
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {currentTotal > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Current vs Recommended</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Aspect</th>
                    <th className="p-3 text-left border">Your Current Setup</th>
                    <th className="p-3 text-left border">Our Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border font-medium">Monthly Cost</td>
                    <td className="p-3 border">{formatCurrency(currentTotal)}</td>
                    <td className="p-3 border text-green-600 font-semibold">
                      {formatCurrency(bestOption.totalWithTax)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border font-medium">Annual Cost</td>
                    <td className="p-3 border">{formatCurrency(currentTotal * 12)}</td>
                    <td className="p-3 border text-green-600 font-semibold">
                      {formatCurrency(bestOption.totalWithTax * 12)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">Services</td>
                    <td className="p-3 border">
                      {formData.currentSubscriptions.map(sub => sub.name).join(', ')}
                    </td>
                    <td className="p-3 border">
                      {bestOption.coveredServices.join(', ')}
                    </td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="p-3 border font-medium">Potential Savings</td>
                    <td className="p-3 border">-</td>
                    <td className="p-3 border text-green-600 font-bold">
                      {formatCurrency(monthlySavings)}/mo ({formatCurrency(annualSavings)}/yr)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Start Over
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Print Results
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Apple Services Optimizer
          </h1>
          <p className="text-gray-600">
            Find the most cost-effective way to subscribe to your favorite Apple services
          </p>
        </div>

        {/* Progress Bar */}
        {step < 6 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {['Services', 'Family', 'Discounts', 'Location', 'Current'].map((label, idx) => (
                <div
                  key={idx}
                  className={`text-sm font-medium ${
                    step > idx + 1 ? 'text-blue-600' : step === idx + 1 ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderResults()}

          {/* Navigation Buttons */}
          {step < 6 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !Object.values(formData.services).some(v => v)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleCalculate}
                  className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-lg"
                >
                  Calculate Best Plan
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Prices shown are based on current US pricing and may vary by region.</p>
          <p className="mt-1">Last updated: January 2025</p>
        </div>
      </div>
    </div>
  );
};

export default AppleServicesOptimizer;