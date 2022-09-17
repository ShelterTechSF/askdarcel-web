// This provides a map of the UCSF relevant eligibilities in our database.
// When the eligibilities are selected, we include their IDs in Algolia queries

// The checked ID is used to determine an eligibility's checked status on
// the UcsfClientEligilityPage. The ID prop is only used once to determine
// if an eligiblity is a "See all" eligibility or not, in which case
// it should not be includeed in the refinements passed to Algolia
export interface Eligibility {
  id: string;
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

export const seeAllPseudoId = '-1';

/* eslint-disable object-curly-newline */
export const eligibilityMap: UcsfEligibilityMap = {
  'ucsf-mental-health-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '0', name: 'See all', checked: false },
        { id: '10007', checkedId: '1', name: 'Elderly', checked: false },
        { id: '10008', checkedId: '2', name: 'Adolescents', checked: false },
        { id: '1035', checkedId: '3', name: 'Pregnant', checked: false },
      ],
    },
    {
      label: 'Gender',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '4', name: 'See all', checked: false },
        { id: '-1', checkedId: '5', name: 'Women', checked: false },
      ],
    },
    {
      label: 'Health Related',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '6', name: 'See all', checked: false },
        { id: '-1', checkedId: '7', name: 'HIV/AIDS', checked: false },
        { id: '-1', checkedId: '8', name: 'Dual Diagnosis', checked: false },
        { id: '-1', checkedId: '9', name: 'People who use Drugs', checked: false },
      ],
    },
    {
      label: 'Other identities/categories',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '10', name: 'See all', checked: false },
        { id: '-1', checkedId: '11', name: 'LGBTQ+', checked: false },
        { id: '-1', checkedId: '12', name: 'Transgender', checked: false },
        { id: '-1', checkedId: '13', name: 'Sex worker', checked: false },
        { id: '-1', checkedId: '14', name: 'Veterans', checked: false },
        { id: '-1', checkedId: '15', name: 'Latinx', checked: false },
        { id: '-1', checkedId: '16', name: 'Homeless', checked: false },
      ],
    },
  ],

  'ucsf-shelter-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '17', name: 'See all', checked: false },
        { id: '0', checkedId: '18', name: 'Families with children (<18yo)', checked: false },
        { id: '1', checkedId: '19', name: 'Age 12-17', checked: false },
        { id: '2', checkedId: '20', name: 'Age 18-24', checked: false },
        { id: '3', checkedId: '21', name: 'Pregnant', checked: false },
      ],
    },
    {
      label: 'Gender',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '22', name: 'See all', checked: false },
        { id: '4', checkedId: '23', name: 'Women', checked: false },
        { id: '5', checkedId: '24', name: 'Men', checked: false },
        { id: '6', checkedId: '25', name: 'Non-binary', checked: false },
      ],
    },
    {
      label: 'Health Related',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '26', name: 'See all', checked: false },
        { id: '7', checkedId: '27', name: 'Dual Diagnosis', checked: false },
      ],
    },
    {
      label: 'Other identities/categories',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '28', name: 'See all', checked: false },
        { id: '8', checkedId: '29', name: 'LGBTQ+', checked: false },
        { id: '9', checkedId: '30', name: 'Veterans', checked: false },
      ],
    },
  ],

  'ucsf-substance-use-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { id: seeAllPseudoId, checkedId: '31', name: 'See all', checked: false },
        { id: '1035', checkedId: '32', name: 'Pregnant', checked: false },
      ],
    },
  ],
};
