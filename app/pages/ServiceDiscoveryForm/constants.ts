type Step = 'eligibilities' | 'subcategories' | 'results';

export interface ServiceCategory {
  algoliaCategoryName: string;
  id: string;
  name: string;
  slug: string;
  steps: Step[];
  subcategorySubheading: string;
}

const defaultSubheading = 'What are you currently looking for? Select all that apply.';

export const CATEGORIES: Readonly<ServiceCategory[]> = [
  {
    algoliaCategoryName: 'Covid-food',
    id: '1000001',
    name: 'Food resources',
    slug: 'food-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-hygiene',
    id: '1000002',
    name: 'Hygiene resources',
    slug: 'hygiene-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-health',
    id: '1000005',
    name: 'Medical Services',
    slug: 'medical-services-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-domesticviolence',
    id: '1000006',
    name: 'Domestic Violence',
    slug: 'domestic-violence-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-internet',
    id: '1000007',
    name: 'Internet Access',
    slug: 'internet-access-resources',
    steps: ['results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-finance',
    id: '1000003',
    name: 'Financial',
    slug: 'financial-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-jobs',
    id: '1000009',
    name: 'Job Assistance',
    slug: 'job-assistance-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-housing',
    id: '1000004',
    name: 'Rental Assistance',
    slug: 'rental-assistance-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-lgbtqa',
    id: '1000008',
    name: 'LGBTQ Resources',
    slug: 'lgbtq-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Covid-shelter',
    id: '1000010',
    name: 'Shelter resources',
    slug: 'shelter-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: 'If you need shelter, then tell us more about who you are. Select one answer.',
  },
  {
    algoliaCategoryName: 'Ucsf-substance-use',
    id: '1000010',
    name: 'Substance use resources',
    slug: 'substance-use-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: 'Ucsf-mental-health',
    id: '1000010',
    name: 'Mental health resources',
    slug: 'mental-health-resources',
    steps: ['subcategories', 'results'],
    subcategorySubheading: defaultSubheading,
  },
];
