export type Step =
  | "housingStatus"
  | "subcategoriesRadio"
  | "eligibilities"
  | "subcategories"
  | "results";

export interface ServiceCategory {
  algoliaCategoryName: string;
  disableGeoLocation?: boolean;
  sortAlgoliaSubcategoryRefinements?: boolean;
  id: string;
  name: string;
  abbreviatedName?: string;
  slug: string;
  steps: Step[];
  subcategorySubheading: string;
  icon: {
    name: string;
    provider: string;
  };
}

const defaultSubheading =
  "What are you currently looking for? Select all that apply.";

export const CATEGORIES: Readonly<ServiceCategory[]> = [
  {
    algoliaCategoryName: "Arts, Culture & Identity",
    id: "356",
    name: "Arts, Culture & Identity",
    slug: "arts-culture-identity",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
    icon: {
      name: "fa-palette",
      provider: "fa",
    },
  },
  {
    algoliaCategoryName: "Childcare",
    id: "357",
    name: "Childcare",
    slug: "childcare",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
    icon: {
      name: "fa-baby",
      provider: "fa",
    },
  },
  {
    algoliaCategoryName: "Education",
    id: "358",
    name: "Education",
    slug: "education",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
    icon: {
      name: "fa-school",
      provider: "fa",
    },
  },
  {
    algoliaCategoryName: "Family Support",
    id: "359",
    name: "Family Support",
    slug: "family-support",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
    icon: {
      name: "fa-people-roof",
      provider: "fa",
    },
  },
  {
    algoliaCategoryName: "Health & Wellness",
    id: "360",
    name: "Health & Wellness",
    slug: "health-wellness",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
    icon: {
      name: "fa-heart-pulse",
      provider: "fa",
    },
  },
  {
    algoliaCategoryName: "Sports & Recreation",
    id: "361",
    name: "Sports & Recreation",
    slug: "sports-recreation",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
    icon: {
      name: "fa-running",
      provider: "fa",
    },
  },
  {
    algoliaCategoryName: "Youth Workforce & Life Skills",
    id: "362",
    name: "Youth Workforce & Life Skills",
    slug: "youth-workforce-life-skills",
    steps: ["subcategories", "results"],
    subcategorySubheading: defaultSubheading,
    icon: {
      name: "fa-briefcase",
      provider: "fa",
    },
  },
];
