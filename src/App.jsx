import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Save,
  Share2,
  Users,
  X
} from 'lucide-react';
import { STORAGE_TIERS } from './data/plans';
import {
  CURRENCY_SYMBOLS,
  REGION_CONFIG,
  SUPPORTED_COUNTRIES,
  SUPPORTED_CURRENCIES
} from './data/regions';
import {
  buildRecommendations,
  getDefaultCurrencyForCountry,
  getRegionTax
} from './lib/optimizer';

const SERVICE_OPTIONS = [
  { key: 'music', label: 'Apple Music', desc: 'Stream millions of songs' },
  { key: 'tv', label: 'Apple TV+', desc: 'Original shows and movies' },
  { key: 'news', label: 'Apple News+', desc: 'Magazines and newspapers' },
  { key: 'fitness', label: 'Apple Fitness+', desc: 'Workout videos (requires Apple Watch)' },
  { key: 'arcade', label: 'Apple Arcade', desc: 'Gaming subscription' },
  { key: 'icloud', label: 'iCloud+', desc: 'Cloud storage' }
];

const DEVICE_OPTIONS = [
  { key: 'iphone', label: 'iPhone (3 months free Apple TV+)' },
  { key: 'ipad', label: 'iPad (3 months free Apple TV+)' },
  { key: 'mac', label: 'Mac (3 months free Apple TV+)' },
  { key: 'appleWatch', label: 'Apple Watch (3 months free Fitness+)' }
];

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

  const [results, setResults] = useState([]);
  const [currentSubDraft, setCurrentSubDraft] = useState({ name: '', price: '' });

  const hasSelectedAnyService = useMemo(
    () => Object.values(formData.services).some((value) => value),
    [formData.services]
  );

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service]
      }
    }));
  };

  const handleCountryChange = (country) => {
    updateFormData('country', country);
    updateFormData('currency', getDefaultCurrencyForCountry(country));
  };

  const formatMoney = (amount, currency = formData.currency) => {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${Number(amount).toFixed(2)}`;
  };

  const handleCalculate = () => {
    const recommendations = buildRecommendations(formData);
    setResults(recommendations);
    setStep(6);
  };

  const saveResults = () => {
    localStorage.setItem(
      'appleServicesResults',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        formData,
        results
      })
    );
    alert('Results saved successfully!');
  };

  const shareResults = () => {
    if (!results || results.length === 0) return;

    const bestOption = results[0];
    const shareText = `Apple Services Optimizer Results:\nBest Option: ${bestOption.name}\nMonthly Cost: ${formatMoney(bestOption.totalWithTax, bestOption.currency)}\nOverbuy: ${bestOption.overbuyLabel}`;

    navigator.clipboard.writeText(shareText);
    alert('Results copied to clipboard!');
  };

  const addCurrentSubscription = () => {
    const parsedPrice = Number(currentSubDraft.price);

    if (!currentSubDraft.name.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return;
    }

    updateFormData('currentSubscriptions', [
      ...formData.currentSubscriptions,
      {
        name: currentSubDraft.name.trim(),
        price: parsedPrice
      }
    ]);

    setCurrentSubDraft({ name: '', price: '' });
  };

  const removeCurrentSubscription = (name) => {
    updateFormData(
      'currentSubscriptions',
      formData.currentSubscriptions.filter((sub) => sub.name !== name)
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Which Apple services do you want?</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SERVICE_OPTIONS.map((service) => (
          <button
            key={service.key}
            type="button"
            onClick={() => toggleService(service.key)}
            className={`rounded-lg border-2 p-4 text-left transition ${
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
              {formData.services[service.key] && <Check className="h-5 w-5 text-blue-500" />}
            </div>
          </button>
        ))}
      </div>

      {formData.services.icloud && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            How much iCloud storage do you need?
          </label>
          <select
            value={formData.icloudStorage}
            onChange={(event) => updateFormData('icloudStorage', event.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          >
            {STORAGE_TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Family & Sharing</h2>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          How many people in your Apple Family?
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => updateFormData('familySize', num)}
              className={`rounded-lg px-4 py-2 font-medium transition ${
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
          <Users className="mr-1 inline h-4 w-4" />
          Apple Family Sharing allows up to 6 people to share subscriptions.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Eligibility & Discounts</h2>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Mobile Carrier</label>
        <select
          value={formData.carrier}
          onChange={(event) => updateFormData('carrier', event.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2"
        >
          <option value="none">No carrier discount</option>
          <option value="verizon">Verizon</option>
          <option value="tmobile">T-Mobile</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="student"
          type="checkbox"
          checked={formData.isStudent}
          onChange={(event) => updateFormData('isStudent', event.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="student" className="text-sm font-medium text-gray-700">
          I&apos;m a student (eligible for student discount)
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Recently purchased Apple devices?
        </label>
        <div className="space-y-2">
          {DEVICE_OPTIONS.map((device) => (
            <div key={device.key} className="flex items-center gap-2">
              <input
                id={device.key}
                type="checkbox"
                checked={formData.recentDevices.includes(device.key)}
                onChange={(event) => {
                  const nextDevices = event.target.checked
                    ? [...formData.recentDevices, device.key]
                    : formData.recentDevices.filter((item) => item !== device.key);
                  updateFormData('recentDevices', nextDevices);
                }}
                className="h-4 w-4"
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
          id="corporate"
          type="checkbox"
          checked={formData.hasCorporateDiscount}
          onChange={(event) => updateFormData('hasCorporateDiscount', event.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="corporate" className="text-sm font-medium text-gray-700">
          I have a corporate/business discount (5% on Apple direct services)
        </label>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const tax = getRegionTax(formData.country);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Location & Currency</h2>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Country/Region</label>
          <select
            value={formData.country}
            onChange={(event) => handleCountryChange(event.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          >
            {SUPPORTED_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-600">
            Tax model: {tax.mode} ({(tax.rate * 100).toFixed(0)}%)
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Currency</label>
          <select
            value={formData.currency}
            onChange={(event) => updateFormData('currency', event.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          >
            {SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {formData.currency !== REGION_CONFIG[formData.country].defaultCurrency && (
            <p className="mt-1 text-sm text-orange-600">
              Display currency differs from regional default. Prices are converted for display.
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Current Subscriptions (Optional)</h2>
      <p className="text-gray-600">Add your current monthly subscriptions to compare savings.</p>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <AlertCircle className="mr-2 inline h-5 w-5 text-blue-600" />
        <span className="text-sm text-blue-800">This step is optional. Skip if needed.</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={currentSubDraft.name}
          onChange={(event) => setCurrentSubDraft((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Service name"
          className="flex-1 rounded-lg border border-gray-300 p-2"
        />
        <input
          type="number"
          step="0.01"
          value={currentSubDraft.price}
          onChange={(event) => setCurrentSubDraft((prev) => ({ ...prev, price: event.target.value }))}
          placeholder="Price"
          className="w-28 rounded-lg border border-gray-300 p-2"
        />
        <button
          type="button"
          onClick={addCurrentSubscription}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {formData.currentSubscriptions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Your Current Setup:</h3>
          {formData.currentSubscriptions.map((sub) => (
            <div key={`${sub.name}-${sub.price}`} className="flex items-center justify-between rounded bg-gray-50 p-2">
              <span>{sub.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatMoney(sub.price)}/mo</span>
                <button
                  type="button"
                  onClick={() => removeCurrentSubscription(sub.name)}
                  className="rounded p-1 text-gray-500 hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    if (!results || results.length === 0) {
      return (
        <div className="py-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
          <p className="text-gray-600">No suitable plans found. Adjust your selections.</p>
        </div>
      );
    }

    const bestOption = results[0];
    const currentTotal = formData.currentSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const monthlySavings = currentTotal > 0 ? currentTotal - bestOption.totalWithTax : 0;
    const annualSavings = monthlySavings * 12;

    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Your Optimal Plan</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveResults}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              type="button"
              onClick={shareResults}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        <div className="rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-2 inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{bestOption.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{bestOption.overbuyLabel}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatMoney(bestOption.totalWithTax, bestOption.currency)}
              </div>
              <div className="text-sm text-gray-600">steady-state monthly</div>
              <div className="text-xs text-green-700">
                First-year effective: {formatMoney(bestOption.firstYearEffectiveMonthly, bestOption.currency)}
              </div>
            </div>
          </div>

          <div className="mb-4 space-y-2 text-sm">
            {bestOption.taxMode === 'inclusive' ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pre-tax equivalent:</span>
                  <span>{formatMoney(bestOption.preTax, bestOption.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Included tax ({(bestOption.taxRate * 100).toFixed(0)}%):</span>
                  <span>{formatMoney(bestOption.tax, bestOption.currency)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatMoney(bestOption.subtotal, bestOption.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({(bestOption.taxRate * 100).toFixed(0)}%):</span>
                  <span>{formatMoney(bestOption.tax, bestOption.currency)}</span>
                </div>
              </>
            )}
            {bestOption.corporateDiscount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Corporate discount applied:</span>
                <span>-{formatMoney(bestOption.corporateDiscount, bestOption.currency)}</span>
              </div>
            )}
          </div>

          <div className="mb-4 rounded-lg bg-white p-4">
            <h4 className="mb-3 font-semibold text-gray-800">What&apos;s Included</h4>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {bestOption.components.map((component) => (
                <div key={component.id} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-800">{component.name}</div>
                    {component.billingPeriod === 'annual' && (
                      <div className="text-xs text-gray-500">Billed annually</div>
                    )}
                    {component.prerequisite && (
                      <div className="text-xs text-orange-600">{component.prerequisite}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {bestOption.promotions.length > 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="mb-1 font-semibold text-green-800">Promotions Used</div>
              {bestOption.promotions.map((promotion) => (
                <div key={promotion} className="text-sm text-green-700">
                  • {promotion}
                </div>
              ))}
            </div>
          )}

          {bestOption.prerequisiteWarnings.length > 0 && (
            <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
              <div className="mb-1 font-semibold text-orange-800">Check prerequisites</div>
              {bestOption.prerequisiteWarnings.map((warning) => (
                <div key={warning} className="text-sm text-orange-700">
                  • {warning}
                </div>
              ))}
            </div>
          )}

          {currentTotal > 0 && (
            <div className="mt-4 rounded-lg border border-green-300 bg-green-100 p-4">
              <div className="mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Your Savings</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-700">Monthly Savings</div>
                  <div className="text-2xl font-bold text-green-600">{formatMoney(monthlySavings)}</div>
                </div>
                <div>
                  <div className="text-sm text-green-700">Annual Savings</div>
                  <div className="text-2xl font-bold text-green-600">{formatMoney(annualSavings)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {results.length > 1 && (
          <div>
            <h3 className="mb-4 text-xl font-bold text-gray-800">Alternative Options</h3>
            <div className="space-y-4">
              {results.slice(1).map((option) => (
                <div key={`${option.name}-${option.totalWithTax}`} className="rounded-lg border border-gray-300 p-5 transition hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{option.name}</h4>
                      <p className="text-sm text-gray-600">{option.overbuyLabel}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {formatMoney(option.totalWithTax, option.currency)}
                      </div>
                      <div className="text-xs text-gray-600">per month</div>
                      <div className="mt-1 text-sm text-orange-600">
                        +{formatMoney(option.totalWithTax - bestOption.totalWithTax, option.currency)} vs best
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="mb-2 text-sm font-medium text-gray-700">Includes:</div>
                    <div className="flex flex-wrap gap-2">
                      {option.components.map((component) => (
                        <span
                          key={component.id}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                        >
                          {component.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setResults([]);
              setStep(1);
            }}
            className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-300"
          >
            Start Over
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600"
          >
            Print Results
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">Apple Services Optimizer</h1>
          <p className="text-gray-600">
            Find the most cost-effective service mix with tax/currency-aware pricing and overbuy controls.
          </p>
        </div>

        {step < 6 && (
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              {['Services', 'Family', 'Discounts', 'Location', 'Current'].map((label, idx) => (
                <div
                  key={label}
                  className={`text-sm font-medium ${
                    step > idx + 1 ? 'text-blue-600' : step === idx + 1 ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="rounded-xl bg-white p-8 shadow-lg">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderResults()}

          {step < 6 && (
            <div className="mt-8 flex justify-between border-t pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-300"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !hasSelectedAnyService}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3 text-lg font-medium text-white transition hover:bg-green-600"
                >
                  Calculate Best Plan
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Regional taxes and conversions are approximations for recommendation purposes.
          </p>
          <p className="mt-1">Last updated: February 27, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default AppleServicesOptimizer;
