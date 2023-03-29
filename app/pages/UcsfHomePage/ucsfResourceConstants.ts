export interface ResourceItem {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
  slug: string;
}

export const UCSF_RESOURCES: ResourceItem[] = [
  {
    id: "2000001",
    name: "Mental Health",
    icon: "smiley-face",
    checked: false,
    slug: "ucsf-mental-health-resources",
  },
  {
    id: "2000002",
    name: "Shelter",
    icon: "bed",
    checked: false,
    slug: "ucsf-shelter-resources",
  },
  {
    id: "2000003",
    name: "Substance Use",
    icon: "substance-use",
    checked: false,
    slug: "ucsf-substance-use-resources",
  },
  {
    id: "2000004",
    name: "Food Insecurity",
    icon: "food",
    checked: false,
    slug: "ucsf-food-insecurity-resources",
  },
  {
    id: "2000005",
    name: "Immigration",
    icon: "globe",
    checked: false,
    slug: "ucsf-immigration-resources",
  },
];
