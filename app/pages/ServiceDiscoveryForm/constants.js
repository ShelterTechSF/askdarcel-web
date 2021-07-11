export const STEPS = {
  ELIGIBILITIES: 'eligibilities',
  SUBCATEGORIES: 'subcategories',
  RESULTS: 'results',
};

export const CATEGORIES = [
  {
    algoliaCategoryName: 'Covid-food',
    id: '1000001',
    name: 'Food resources',
    slug: 'food-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-hygiene',
    id: '1000002',
    name: 'Hygiene resources',
    slug: 'hygiene-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-health',
    id: '1000005',
    name: 'Medical Services',
    slug: 'medical-services-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-domesticviolence',
    id: '1000006',
    name: 'Domestic Violence',
    slug: 'domestic-violence-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-internet',
    id: '1000007',
    name: 'Internet Access',
    slug: 'internet-access-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-finance',
    id: '1000003',
    name: 'Financial',
    slug: 'financial-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-jobs',
    id: '1000009',
    name: 'Job Assistance',
    slug: 'job-assistance-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-housing',
    id: '1000004',
    name: 'Rental Assistance',
    slug: 'rental-assistance-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-lgbtqa',
    id: '1000008',
    name: 'LGBTQ Resources',
    slug: 'lgbtq-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
  {
    algoliaCategoryName: 'Covid-shelter',
    id: '1000010',
    name: 'Shelter resources',
    slug: 'shelter-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
  },
];
