
// We are hardcoding the eligibility data as it currently exists on the design specs.
// When content has entered UCSF specific eligibilities, will we fetch that data from the API

export interface ucsfServiceTypeDictionary {
  [key: string]: object;
}

const serviceTypeData: ucsfServiceTypeDictionary = {
  'mental-health-resources': {
    label: 'Mental Health',
    types: [
      { name: 'See all', checked: true },
      { name: 'Emergency', checked: true },
      { name: 'Services/Urgent care', checked: true },
      { name: 'General outpatient services', checked: true },
      { name: 'Overnight/Prolonged observation', checked: true },
    ],
  },

  'shelter-resources': {
    label: 'Shelter',
    types: [
      { name: 'See all', checked: true },
      { name: 'At home support', checked: true },
      { name: 'One-night shelter', checked: true },
      { name: 'Long-term shelter', checked: true },
    ],
  },

  'substance-use-resources': {
    label: 'Substance Use',
    types: [
      { name: 'See all', checked: true },
      { name: 'Wraparound', checked: true },
      { name: 'Healthier', checked: true },
      { name: 'Habits/Safer use', checked: true },
      { name: 'Meetings/Support', checked: true },
      { name: 'Residential', checked: true },
      { name: 'Treatment (Active medical mgtm, Passive medical mgtm', checked: true },
      { name: 'Medication treatment (Difference cirrhosis, AST/ALT > 200, anticoag', checked: true },
      { name: 'Safe place to sober up', checked: true },
      { name: 'Reward program', checked: true },
    ],
  },
};

export { serviceTypeData };
