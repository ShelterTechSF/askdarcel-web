export type Step = 'housingStatus' | 'subcategoriesRadio' | 'eligibilities' | 'subcategories' | 'results';

/* Todo: The CustomRefinement and CustomStepMethods interfaces/properties were created to finish a
   time-sensitive project to complete the Long Term Housing tile pathway. The LTH pathway has more
   complex refinement options than our existing tiles do. This code and the step data struture
   can/should be refactored and improved to more broadly support more complex refinement pathways
**/

export interface CustomRefinements {
  [key: string]: CustomRefinement[];
}

export interface CustomRefinement {
  id: number;
  name: string;
}

export interface CustomStepMethods {
  [key: string]: Function;
}

export interface ServiceCategory {
  algoliaCategoryName: string;
  id: string;
  name: string;
  slug: string;
  steps: Step[];
  subcategorySubheading: string;
  customRefinements?: CustomRefinements;
  customStepMethods?: CustomStepMethods;
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
    algoliaCategoryName: 'Covid-longterm-housing',
    id: '1000011',
    name: 'Long-term Housing',
    slug: 'longterm-housing-resources',
    steps: ['housingStatus', 'subcategoriesRadio', 'results'],
    customStepMethods: {
      housingStatus: (
        targetRefinementId: number,
        history: any,
        setSelectedCategoryId: (targetCategoryId: number) => void,
      ) => {
        if (targetRefinementId === 1100045) {
          // User has selected first option. Redirect user to the shelter resources form.
          setSelectedCategoryId(1000010);
          history.push('/shelter-resources/form');
        } else {
          // todo: API is currently returning subcategories with incorrects IDs;
          // they are 100,000 higher than they should be; thus the subtraction below
          setSelectedCategoryId(targetRefinementId - 100000);
        }
      },
    },
    subcategorySubheading: 'If you need shelter, then tell us more about who you are. Select one answer.',
  },
];
