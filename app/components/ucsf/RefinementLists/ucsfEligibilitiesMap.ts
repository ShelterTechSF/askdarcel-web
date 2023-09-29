// This provides a map of the designed UCSF eligibility structure. Until the API
// has devised a system for creating a parent/child eligibility data structure,
// we will store UCSF eligibilities as constants on the frontend

// The checkedId property is used as the key to an eligibility's checked value on
// the UcsfClientEligilityPage UI. When a given eligibility is checked, it is is
// included in the Algolia query on the /results page.
export interface Eligibility {
  isSeeAll: boolean;
  checkedId: string;
  name: string;
  alias?: string;
  checked: boolean;
}

export interface EligibilityGroup {
  label: string;
  eligibilities: Eligibility[];
}

interface UcsfEligibilityMap {
  [key: string]: EligibilityGroup[];
}

// N.B.: Until we have found a way to make use of Algolia's "Show More" refinements button,
// none of the below resource groups should have a _total_ eligibility amount that exceeds the
// refinementListLimit value defined in the UCSF whitelabel config in whitelabel.ts.
// E.g., The ucsf-mental-health-resources should not have more than a sum total of X eligibilities
// among all of its eligibility groups. This excludes any "See All" eligibilities, which we do not
// display in the sidebar.

/* eslint-disable object-curly-newline */
export const eligibilityMap: Readonly<UcsfEligibilityMap> = {
  "ucsf-mental-health-resources": [
    {
      label: "Age and Dependents",
      eligibilities: [
        { isSeeAll: true, checkedId: "0", name: "See All", checked: false },
        { isSeeAll: false, checkedId: "1", name: "Elderly", checked: false },
        {
          isSeeAll: false,
          checkedId: "2",
          name: "Adolescents",
          checked: false,
        },
        { isSeeAll: false, checkedId: "3", name: "Pregnant", checked: false },
      ],
    },
    {
      label: "Gender",
      eligibilities: [
        { isSeeAll: true, checkedId: "4", name: "See All", checked: false },
        { isSeeAll: false, checkedId: "5", name: "Women", checked: false },
      ],
    },
    {
      label: "Health Related",
      eligibilities: [
        { isSeeAll: true, checkedId: "6", name: "See All", checked: false },
        { isSeeAll: false, checkedId: "7", name: "HIV/AIDS", checked: false },
        {
          isSeeAll: false,
          checkedId: "8",
          name: "Dual Diagnosis",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "9",
          name: "People who use drugs",
          checked: false,
        },
      ],
    },
    {
      label: "Other identities/categories",
      eligibilities: [
        { isSeeAll: true, checkedId: "10", name: "See All", checked: false },
        { isSeeAll: false, checkedId: "11", name: "LGBTQ+", checked: false },
        {
          isSeeAll: false,
          checkedId: "12",
          name: "Transgender and Gender Non-Conforming",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "13",
          name: "Sex Worker",
          checked: false,
        },
        { isSeeAll: false, checkedId: "14", name: "Veterans", checked: false },
        { isSeeAll: false, checkedId: "15", name: "Latinx", checked: false },
        { isSeeAll: false, checkedId: "16", name: "Homeless", checked: false },
      ],
    },
  ],

  "ucsf-shelter-resources": [
    {
      label: "Age and Dependents",
      eligibilities: [
        { isSeeAll: true, checkedId: "17", name: "See All", checked: false },
        {
          isSeeAll: false,
          checkedId: "18",
          name: "Families with children below 18 years old",
          checked: false,
        },
        { isSeeAll: false, checkedId: "19", name: "Age 12-17", checked: false },
        { isSeeAll: false, checkedId: "20", name: "Age 18-24", checked: false },
        { isSeeAll: false, checkedId: "21", name: "Pregnant", checked: false },
      ],
    },
    {
      label: "Gender",
      eligibilities: [
        { isSeeAll: true, checkedId: "22", name: "See All", checked: false },
        { isSeeAll: false, checkedId: "23", name: "Women", checked: false },
        { isSeeAll: false, checkedId: "24", name: "Men", checked: false },
        {
          isSeeAll: false,
          checkedId: "25",
          name: "Non-Binary",
          checked: false,
        },
      ],
    },
    {
      label: "Health Related",
      eligibilities: [
        { isSeeAll: true, checkedId: "26", name: "See All", checked: false },
        {
          isSeeAll: false,
          checkedId: "27",
          name: "Dual Diagnosis",
          checked: false,
        },
      ],
    },
    {
      label: "Other identities/categories",
      eligibilities: [
        { isSeeAll: true, checkedId: "28", name: "See All", checked: false },
        { isSeeAll: false, checkedId: "29", name: "LGBTQ+", checked: false },
        { isSeeAll: false, checkedId: "30", name: "Veterans", checked: false },
      ],
    },
  ],

  "ucsf-substance-use-resources": [
    {
      label: "Age and Dependents",
      eligibilities: [
        { isSeeAll: true, checkedId: "31", name: "See All", checked: false },
        { isSeeAll: false, checkedId: "32", name: "Pregnant", checked: false },
      ],
    },
  ],

  "ucsf-food-insecurity-resources": [
    {
      label: "Age and Dependents",
      eligibilities: [
        { isSeeAll: true, checkedId: "33", name: "See All", checked: false },
        {
          isSeeAll: false,
          checkedId: "34",
          name: "I am a Senior",
          checked: false,
        },
      ],
    },
  ],

  "ucsf-immigration-resources": [
    {
      label: "Other identities/categories",
      eligibilities: [
        { isSeeAll: true, checkedId: "35", name: "See All", checked: false },
        {
          isSeeAll: false,
          checkedId: "36",
          name: "API (Asian/Pacific Islander)",
          alias: "Asian and Pacific Islander",
          checked: false,
        },
        { isSeeAll: false, checkedId: "37", name: "HIV/AIDS", checked: false },
        {
          isSeeAll: false,
          checkedId: "38",
          name: "Latinx",
          alias: "Latinx/Hispanic",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "39",
          name: "Middle Eastern and North African",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "40",
          name: "Youth (below 21 years old)",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "41",
          name: "African/Black",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "42",
          name: "Gender-Based Violence",
          checked: false,
        },
        { isSeeAll: false, checkedId: "43", name: "Jewish", checked: false },
        { isSeeAll: false, checkedId: "44", name: "LGBTQ+", checked: false },
        { isSeeAll: false, checkedId: "45", name: "Women", checked: false },
        {
          isSeeAll: false,
          checkedId: "46",
          name: "Anyone in Need",
          checked: false,
        },
      ],
    },
  ],

  "ucsf-partner-violence-resources": [
    {
      label: "Other identities/categories",
      eligibilities: [
        { isSeeAll: true, checkedId: "35", name: "See All", checked: false },
        {
          isSeeAll: false,
          checkedId: "47",
          name: "API (Asian/Pacific Islander)",
          alias: "Asian and Pacific Islander",
          checked: false,
        },
        { isSeeAll: false, checkedId: "37", name: "Pregnant", checked: false },
        {
          isSeeAll: false,
          checkedId: "48",
          name: "Latinx",
          alias: "Latinx/Hispanic",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "49",
          name: "Middle Eastern and North African",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "50",
          name: "Youth (below 21 years old)",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "51",
          name: "Families with children below 18 years old",
          checked: false,
        },
        {
          isSeeAll: false,
          checkedId: "52",
          name: "African/Black",
          checked: false,
        },
        { isSeeAll: false, checkedId: "53", name: "Jewish", checked: false },
        { isSeeAll: false, checkedId: "54", name: "LGBTQ+", checked: false },
        {
          isSeeAll: false,
          checkedId: "55",
          name: "Anyone in Need",
          checked: false,
        },
      ],
    },
  ],
};

export interface SelectedEligibilities {
  [key: string]: boolean;
}

export const defaultSelectedEligibilities = (
  eligibilityGroup: EligibilityGroup[]
): SelectedEligibilities => {
  const selectedEligibilities: SelectedEligibilities = {};
  const mergedEligibilities = eligibilityGroup.flatMap(
    (group) => group.eligibilities
  );

  mergedEligibilities.forEach((eligibility) => {
    selectedEligibilities[eligibility.checkedId] = eligibility.isSeeAll;
  });

  return selectedEligibilities;
};
