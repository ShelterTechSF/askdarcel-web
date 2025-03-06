export type Step =
  | "housingStatus"
  | "subcategoriesRadio"
  | "eligibilities"
  | "subcategories"
  | "results";

export interface ServiceCategory {
  algoliaCategoryName: string;
  sortBy24HourAvailability?: boolean;
  disableGeoLocation?: boolean;
  sortAlgoliaSubcategoryRefinements?: boolean;
  id: string;
  name: string;
  abbreviatedName?: string;
  slug: string;
  steps: Step[];
  subcategorySubheading: string;
}

const defaultSubheading =
  "What are you currently looking for? Select all that apply.";

export const CATEGORIES: Readonly<ServiceCategory[]> = [
  {
    algoliaCategoryName: "sfsg-food",
    id: "1000001",
    name: "Food Resources",
    slug: "food-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-hygiene",
    id: "1000002",
    name: "Hygiene Resources",
    slug: "hygiene-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-health",
    id: "1000005",
    name: "Medical Services",
    slug: "medical-services-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-domesticviolence",
    id: "1000006",
    name: "Domestic Violence",
    slug: "domestic-violence-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-internet",
    id: "1000007",
    name: "Internet Access",
    slug: "internet-access-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-finance",
    id: "1000003",
    name: "Financial Resources",
    slug: "financial-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-jobs",
    id: "1000009",
    name: "Job Assistance",
    slug: "job-assistance-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-housing",
    id: "1000004",
    name: "Rental Assistance",
    slug: "rental-assistance-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-lgbtqa",
    id: "1000008",
    name: "LGBTQ Resources",
    slug: "lgbtq-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "sfsg-shelter",
    id: "1000010",
    name: "Shelter Resources",
    slug: "shelter-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading:
      "If you need shelter, then tell us more about who you are. Select one answer.",
  },
  {
    algoliaCategoryName: "sfsg-longtermhousing",
    id: "1000011",
    name: "Long-term Housing",
    slug: "longterm-housing-resources",
    steps: ["housingStatus", "subcategoriesRadio", "results"],
    subcategorySubheading:
      "If you need shelter, then tell us more about who you are. Select one answer.",
  },
  {
    algoliaCategoryName: "sfsg-substanceuse",
    id: "1000012",
    name: "Substance Use Resources",
    slug: "substance-use-resources",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "Ucsf-mentalhealth",
    id: "2000001",
    name: "Mental Health Resources",
    abbreviatedName: "Mental Health",
    slug: "ucsf-mental-health-resources",
    steps: ["subcategories", "eligibilities", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "Ucsf-shelter",
    id: "2000002",
    name: "Shelter Resources",
    abbreviatedName: "Shelter",
    slug: "ucsf-shelter-resources",
    steps: ["subcategories", "eligibilities", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "Ucsf-substanceuse",
    id: "2000003",
    name: "Substance Use Resources",
    abbreviatedName: "Substance Use",
    slug: "ucsf-substance-use-resources",
    steps: ["subcategories", "eligibilities", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "Ucsf-foodinsecurity",
    id: "2000004",
    name: "Food Insecurity Resources",
    abbreviatedName: "Food Insecurity",
    slug: "ucsf-food-insecurity-resources",
    steps: ["subcategories", "eligibilities", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "Ucsf-immmigration",
    id: "2000005",
    name: "Immigration Resources",
    abbreviatedName: "Immigration",
    slug: "ucsf-immigration-resources",
    steps: ["eligibilities", "results"],
    subcategorySubheading: defaultSubheading,
  },
  {
    algoliaCategoryName: "Ucsf-intimatepartnerviolence",
    sortBy24HourAvailability: true,
    disableGeoLocation: true,
    id: "2000006",
    name: "Intimate Partner Violence Resources",
    abbreviatedName: "Intimate Partner Violence",
    slug: "ucsf-partner-violence-resources",
    steps: ["subcategories", "eligibilities", "results"],
    subcategorySubheading: defaultSubheading,
    sortAlgoliaSubcategoryRefinements: true,
  },
];
