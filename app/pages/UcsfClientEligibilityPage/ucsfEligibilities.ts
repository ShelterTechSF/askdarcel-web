
// We are hardcoding the eligibility data as it currently exists on the design specs.
// When content has entered UCSF specific eligibilities, will we fetch that data from the API

export interface ucsfEligibilityDictionary {
  [key: string]: object;
}

const eligibilityData: ucsfEligibilityDictionary = {
  'mental-health-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'Elderly Adolescents', checked: true },
        { name: 'Families with children (<18yo)', checked: true },
        { name: 'Young adults (20-30 yo)', checked: true },
        { name: 'Pregnant', checked: true },
      ],
    },
    {
      label: 'Gender',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'Women', checked: true },
      ],
    },
    {
      label: 'Health Related',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'HIV', checked: true },
        { name: 'Dual Diagnosis', checked: true },
        { name: 'People who use drugs', checked: true },
      ],
    },
    {
      label: 'Other identities/categories',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'LGBTQ+', checked: true },
        { name: 'SF Residents', checked: true },
        { name: 'Uninsured', checked: true },
        { name: 'Transgender', checked: true },
        { name: 'Sex worker', checked: true },
        { name: 'Veterans', checked: true },
        { name: 'Latinx', checked: true },
        { name: 'Homeless', checked: true },
      ],
    },
  ],

  'shelter-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'Families with children (<18yo)', checked: true },
        { name: 'Age 12-17', checked: true },
        { name: 'Age 18-24', checked: true },
        { name: 'Pregnant', checked: true },
      ],
    },
    {
      label: 'Gender',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'Women', checked: true },
        { name: 'Men', checked: true },
        { name: 'Non-binary', checked: true },
      ],
    },
    {
      label: 'Health Related',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'Dual Diagnosis', checked: true },
      ],
    },
    {
      label: 'Other identities/categories',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'Low-income Homeless', checked: true },
        { name: 'Abuse or neglect survivors', checked: true },
        { name: 'Domestic violence survivors', checked: true },
        { name: 'LGBTQ+', checked: true },
        { name: 'Veterans', checked: true },
      ],
    },
  ],

  'substance-use-resources': [
    {
      label: 'Age and Dependents',
      eligibilities: [
        { name: 'See all', checked: true },
        { name: 'Pregnant', checked: true },
      ],
    },
  ],
};

export { eligibilityData };
