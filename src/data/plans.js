export const STORAGE_TIERS = ['50GB', '200GB', '2TB', '6TB', '12TB'];

export const SERVICE_IDS = {
  music: 'music',
  tv: 'tv',
  news: 'news',
  fitness: 'fitness',
  arcade: 'arcade',
  icloud: 'icloud'
};

const price = (monthly, annual = null) => ({
  monthly,
  annual
});

// Prices are normalized in USD and can be converted for display.
export const PLAN_CATALOG = [
  {
    id: 'apple-one-individual',
    name: 'Apple One Individual',
    source: 'apple',
    familyShare: 1,
    price: price(19.95),
    includes: [
      { serviceId: SERVICE_IDS.music },
      { serviceId: SERVICE_IDS.tv },
      { serviceId: SERVICE_IDS.arcade },
      { serviceId: SERVICE_IDS.icloud, storageTier: '50GB' }
    ],
    bundle: true
  },
  {
    id: 'apple-one-family',
    name: 'Apple One Family',
    source: 'apple',
    familyShare: 5,
    price: price(25.95),
    includes: [
      { serviceId: SERVICE_IDS.music },
      { serviceId: SERVICE_IDS.tv },
      { serviceId: SERVICE_IDS.arcade },
      { serviceId: SERVICE_IDS.icloud, storageTier: '200GB' }
    ],
    bundle: true
  },
  {
    id: 'apple-one-premier',
    name: 'Apple One Premier',
    source: 'apple',
    familyShare: 5,
    price: price(37.95),
    includes: [
      { serviceId: SERVICE_IDS.music },
      { serviceId: SERVICE_IDS.tv },
      { serviceId: SERVICE_IDS.arcade },
      { serviceId: SERVICE_IDS.news },
      { serviceId: SERVICE_IDS.fitness },
      { serviceId: SERVICE_IDS.icloud, storageTier: '2TB' }
    ],
    bundle: true
  },
  {
    id: 'apple-one-individual-verizon',
    name: 'Apple One Individual (Verizon)',
    source: 'verizon',
    familyShare: 1,
    price: price(15.0),
    prerequisite: 'Requires myPlan',
    includes: [
      { serviceId: SERVICE_IDS.music },
      { serviceId: SERVICE_IDS.tv },
      { serviceId: SERVICE_IDS.arcade },
      { serviceId: SERVICE_IDS.icloud, storageTier: '50GB' }
    ],
    bundle: true
  },
  {
    id: 'apple-one-family-verizon',
    name: 'Apple One Family (Verizon)',
    source: 'verizon',
    familyShare: 5,
    price: price(20.0),
    prerequisite: 'Requires myPlan',
    includes: [
      { serviceId: SERVICE_IDS.music },
      { serviceId: SERVICE_IDS.tv },
      { serviceId: SERVICE_IDS.arcade },
      { serviceId: SERVICE_IDS.icloud, storageTier: '200GB' }
    ],
    bundle: true
  },
  {
    id: 'music-student',
    name: 'Apple Music Student',
    source: 'apple',
    familyShare: 1,
    price: price(5.99),
    prerequisite: 'Student verification required',
    requiresStudent: true,
    includes: [{ serviceId: SERVICE_IDS.music }, { serviceId: SERVICE_IDS.tv }]
  },
  {
    id: 'music-individual',
    name: 'Apple Music Individual',
    source: 'apple',
    familyShare: 1,
    price: price(10.99),
    includes: [{ serviceId: SERVICE_IDS.music }]
  },
  {
    id: 'music-family',
    name: 'Apple Music Family',
    source: 'apple',
    familyShare: 5,
    price: price(16.99),
    includes: [{ serviceId: SERVICE_IDS.music }]
  },
  {
    id: 'music-individual-verizon',
    name: 'Apple Music Individual (Verizon)',
    source: 'verizon',
    familyShare: 1,
    price: price(10.99),
    prerequisite: 'Requires 5G Get More',
    includes: [{ serviceId: SERVICE_IDS.music }]
  },
  {
    id: 'music-family-verizon',
    name: 'Apple Music Family (Verizon)',
    source: 'verizon',
    familyShare: 5,
    price: price(10.0),
    prerequisite: 'Requires myPlan',
    includes: [{ serviceId: SERVICE_IDS.music }]
  },
  {
    id: 'tv-monthly',
    name: 'Apple TV+',
    source: 'apple',
    familyShare: 5,
    price: price(12.99),
    includes: [{ serviceId: SERVICE_IDS.tv }]
  },
  {
    id: 'tv-annual',
    name: 'Apple TV+ (Annual)',
    source: 'apple',
    familyShare: 5,
    price: price(99 / 12, 99),
    billingPeriod: 'annual',
    includes: [{ serviceId: SERVICE_IDS.tv }]
  },
  {
    id: 'tv-tmobile',
    name: 'Apple TV+ (T-Mobile)',
    source: 'tmobile',
    familyShare: 5,
    price: price(3.0),
    prerequisite: 'Requires Better Value or Experience Beyond plan',
    includes: [{ serviceId: SERVICE_IDS.tv }]
  },
  {
    id: 'news-plus',
    name: 'Apple News+',
    source: 'apple',
    familyShare: 5,
    price: price(12.99),
    includes: [{ serviceId: SERVICE_IDS.news }]
  },
  {
    id: 'fitness-monthly',
    name: 'Apple Fitness+',
    source: 'apple',
    familyShare: 5,
    price: price(9.99),
    deviceRequired: 'Apple Watch',
    includes: [{ serviceId: SERVICE_IDS.fitness }]
  },
  {
    id: 'fitness-annual',
    name: 'Apple Fitness+ (Annual)',
    source: 'apple',
    familyShare: 5,
    price: price(79.99 / 12, 79.99),
    billingPeriod: 'annual',
    deviceRequired: 'Apple Watch',
    includes: [{ serviceId: SERVICE_IDS.fitness }]
  },
  {
    id: 'arcade',
    name: 'Apple Arcade',
    source: 'apple',
    familyShare: 5,
    price: price(6.99),
    includes: [{ serviceId: SERVICE_IDS.arcade }]
  },
  {
    id: 'icloud-50',
    name: 'iCloud+ 50GB',
    source: 'apple',
    familyShare: 5,
    price: price(0.99),
    includes: [{ serviceId: SERVICE_IDS.icloud, storageTier: '50GB' }]
  },
  {
    id: 'icloud-200',
    name: 'iCloud+ 200GB',
    source: 'apple',
    familyShare: 5,
    price: price(2.99),
    includes: [{ serviceId: SERVICE_IDS.icloud, storageTier: '200GB' }]
  },
  {
    id: 'icloud-2tb',
    name: 'iCloud+ 2TB',
    source: 'apple',
    familyShare: 5,
    price: price(9.99),
    includes: [{ serviceId: SERVICE_IDS.icloud, storageTier: '2TB' }]
  },
  {
    id: 'icloud-6tb',
    name: 'iCloud+ 6TB',
    source: 'apple',
    familyShare: 5,
    price: price(29.99),
    includes: [{ serviceId: SERVICE_IDS.icloud, storageTier: '6TB' }]
  },
  {
    id: 'icloud-12tb',
    name: 'iCloud+ 12TB',
    source: 'apple',
    familyShare: 5,
    price: price(59.99),
    includes: [{ serviceId: SERVICE_IDS.icloud, storageTier: '12TB' }]
  }
];

export const DEVICE_PROMOTIONS = {
  iphone: { serviceId: SERVICE_IDS.tv, monthsFree: 3 },
  ipad: { serviceId: SERVICE_IDS.tv, monthsFree: 3 },
  mac: { serviceId: SERVICE_IDS.tv, monthsFree: 3 },
  appleWatch: { serviceId: SERVICE_IDS.fitness, monthsFree: 3 }
};
