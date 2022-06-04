export interface IServiceCategory {
  algoliaCategoryName: string;
  id: string;
  name: string;
  slug: string;
  steps: string[];
  subcategorySubheading: string;
}

export const STEPS = {
  ELIGIBILITIES: 'eligibilities',
  SUBCATEGORIES: 'subcategories',
  RESULTS: 'results',
};

const defaultSubheading = 'What are you currently looking for? Select all that apply.';

export const CATEGORIES: IServiceCategory[] = [
  {
    algoliaCategoryName: 'Covid-food',
    id: '1000001',
    name: 'Food resources',
    slug: 'food-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-hygiene',
    id: '1000002',
    name: 'Hygiene resources',
    slug: 'hygiene-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-health',
    id: '1000005',
    name: 'Medical Services',
    slug: 'medical-services-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-domesticviolence',
    id: '1000006',
    name: 'Domestic Violence',
    slug: 'domestic-violence-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-internet',
    id: '1000007',
    name: 'Internet Access',
    slug: 'internet-access-resources',
    steps: [STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-finance',
    id: '1000003',
    name: 'Financial',
    slug: 'financial-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-jobs',
    id: '1000009',
    name: 'Job Assistance',
    slug: 'job-assistance-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-housing',
    id: '1000004',
    name: 'Rental Assistance',
    slug: 'rental-assistance-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-lgbtqa',
    id: '1000008',
    name: 'LGBTQ Resources',
    slug: 'lgbtq-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-shelter',
    id: '1000010',
    name: 'Shelter resources',
    slug: 'shelter-resources',
    steps: [STEPS.SUBCATEGORIES, STEPS.RESULTS],
    subcategorySubheading: 'If you need shelter, then tell us more about who you are. Select one answer.',
  },
];
