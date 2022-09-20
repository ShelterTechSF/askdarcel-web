// This provides a map of the UCSF relevant eligibilities in our database.
// When the eligibilities are selected, we include their IDs in Algolia queries

// The checkedId property is used to determine an eligibility's checked status on
// the UcsfClientEligilityPage.
export interface Eligibility {
  isSeeAll: boolean;
  checkedId: string;
  name: string;
  checked: boolean;
}

export interface EligibilityGroup {
  label: string;
  eligibilities: Eligibility[];
}

interface UcsfEligibilityMap {
  [key: string]: EligibilityGroup[];
}

/* eslint-disable object-curly-newline */
export const eligibilityMap: UcsfEligibilityMap = {
  'ucsf-mental-health-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { isSeeAll: true, checkedId: '0', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '1', name: 'Elderly', checked: false },
        { isSeeAll: false, checkedId: '2', name: 'Adolescents', checked: false },
        { isSeeAll: false, checkedId: '3', name: 'Pregnant', checked: false },
      ],
    },
    {
      label: 'Gender',
      eligibilities: [
        { isSeeAll: true, checkedId: '4', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '5', name: 'Women', checked: false },
      ],
    },
    {
      label: 'Health Related',
      eligibilities: [
        { isSeeAll: true, checkedId: '6', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '7', name: 'HIV/AIDS', checked: false },
        { isSeeAll: false, checkedId: '8', name: 'Dual Diagnosis', checked: false },
        { isSeeAll: false, checkedId: '9', name: 'People who use drugs', checked: false },
      ],
    },
    {
      label: 'Other identities/categories',
      eligibilities: [
        { isSeeAll: true, checkedId: '10', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '11', name: 'LGBTQ+', checked: false },
        { isSeeAll: false, checkedId: '12', name: 'Transgender and Gender Non-Conforming', checked: false },
        { isSeeAll: false, checkedId: '13', name: 'Sex Worker', checked: false },
        { isSeeAll: false, checkedId: '14', name: 'Veterans', checked: false },
        { isSeeAll: false, checkedId: '15', name: 'Latinx', checked: false },
        { isSeeAll: false, checkedId: '16', name: 'Homeless', checked: false },
      ],
    },
  ],

  'ucsf-shelter-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { isSeeAll: true, checkedId: '17', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '18', name: 'Families with children below 18 years old', checked: false },
        { isSeeAll: false, checkedId: '19', name: 'Age 12-17', checked: false },
        { isSeeAll: false, checkedId: '20', name: 'Age 18-24', checked: false },
        { isSeeAll: false, checkedId: '21', name: 'Pregnant', checked: false },
      ],
    },
    {
      label: 'Gender',
      eligibilities: [
        { isSeeAll: true, checkedId: '22', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '23', name: 'Women', checked: false },
        { isSeeAll: false, checkedId: '24', name: 'Men', checked: false },
        { isSeeAll: false, checkedId: '25', name: 'Non-Binary', checked: false },
      ],
    },
    {
      label: 'Health Related',
      eligibilities: [
        { isSeeAll: true, checkedId: '26', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '27', name: 'Dual Diagnosis', checked: false },
      ],
    },
    {
      label: 'Other identities/categories',
      eligibilities: [
        { isSeeAll: true, checkedId: '28', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '29', name: 'LGBTQ+', checked: false },
        { isSeeAll: false, checkedId: '30', name: 'Veterans', checked: false },
      ],
    },
  ],

  'ucsf-substance-use-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { isSeeAll: true, checkedId: '31', name: 'See All', checked: false },
        { isSeeAll: false, checkedId: '32', name: 'Pregnant', checked: false },
      ],
    },
  ],
};
