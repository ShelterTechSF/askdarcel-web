// We are hardcoding the eligibility data as it currently exists on the design specs.
// When content has entered UCSF specific eligibilities, will we fetch that data from the API

export interface ucsfEligibilityDictionary {
  [key: string]: object;
}

export const eligibilityData: ucsfEligibilityDictionary = {
  'mental-health-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'Elderly Adolescents', checked: false },
        { name: 'Families with children (<18yo)', checked: false },
        { name: 'Young adults (20-30 yo)', checked: false },
        { name: 'Pregnant', checked: false },
      ],
    },
    {
      label: 'Gender',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'Women', checked: false },
      ],
    },
    {
      label: 'Health Related',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'HIV', checked: false },
        { name: 'Dual Diagnosis', checked: false },
        { name: 'People who use drugs', checked: false },
      ],
    },
    {
      label: 'Other identities/categories',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'LGBTQ+', checked: false },
        { name: 'SF Residents', checked: false },
        { name: 'Uninsured', checked: false },
        { name: 'Transgender', checked: false },
        { name: 'Sex worker', checked: false },
        { name: 'Veterans', checked: false },
        { name: 'Latinx', checked: false },
        { name: 'Homeless', checked: false },
      ],
    },
  ],

  'shelter-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'Families with children (<18yo)', checked: false },
        { name: 'Age 12-17', checked: false },
        { name: 'Age 18-24', checked: false },
        { name: 'Pregnant', checked: false },
      ],
    },
    {
      label: 'Gender',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'Women', checked: false },
        { name: 'Men', checked: false },
        { name: 'Non-binary', checked: false },
      ],
    },
    {
      label: 'Health Related',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'Dual Diagnosis', checked: false },
      ],
    },
    {
      label: 'Other identities/categories',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'Low-income Homeless', checked: false },
        { name: 'Abuse or neglect survivors', checked: false },
        { name: 'Domestic violence survivors', checked: false },
        { name: 'LGBTQ+', checked: false },
        { name: 'Veterans', checked: false },
      ],
    },
  ],

  'substance-use-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { name: 'See all', checked: false },
        { name: 'Pregnant', checked: false },
      ],
    },
  ],
};
