export type Step = 'housingStatus' | 'longTermHousingOptions' | 'eligibilities' | 'subcategories' | 'results';

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
    algoliaCategoryName: 'Covid-shelter',
    id: '1000010',
    name: 'Long-term Housing',
    slug: 'longterm-housing-resources',
    steps: ['housingStatus', 'longTermHousingOptions', 'subcategories', 'results'],
    customRefinements: {
      housingStatus: [
        { id: 1, name: 'I am experiencing homelessness and I need immediate help finding shelter.' },
        { id: 2, name: 'I am experiencing homelessness (on the street, couchsurfing, or other) and I need long-term housing assistance.' },
        { id: 3, name: 'I am not currently experiencing homelessness, but I am looking for a long-term affordable housing unit.' },
      ],
      longTermHousingOptions: [
        { id: 1, name: 'I am looking to rent a home.' },
        { id: 2, name: 'I am looking to buy a home.' },
      ],
    },
    customStepMethods: {
      housingStatus: (
        selectedRefinement: any,
        history: any,
        _setCurrentStep: (targetStep: number) => void,
      ) => {
        if (selectedRefinement === 1) {
          // Todo: switch this to shelter
          history.push('/shelter-resources/form');
        } else if (selectedRefinement === 2) {
          // Go to subcagtegories step
          _setCurrentStep(2);
        } else if (selectedRefinement === 3) {
          // Go to long term housing options step
          _setCurrentStep(1);
        }
      },
    },
    subcategorySubheading: 'If you need shelter, then tell us more about who you are. Select one answer.',
  },
];
