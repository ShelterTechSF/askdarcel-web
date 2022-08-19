// We are hardcoding the eligibility data as it currently exists on the design specs.
// When content has entered UCSF specific eligibilities, will we fetch that data from the API

export interface UcsfServiceTypeDictionary {
  [key: string]: object;
}

const serviceTypeData: UcsfServiceTypeDictionary = {
  'mental-health-resources': {
    label: 'Mental Health',
    types: [
      { name: 'See all', checked: false },
      { name: 'Emergency', checked: false },
      { name: 'Services/Urgent care', checked: false },
      { name: 'General outpatient services', checked: false },
      { name: 'Overnight/Prolonged observation', checked: false },
    ],
  },

  'shelter-resources': {
    label: 'Shelter',
    types: [
      { name: 'See all', checked: false },
      { name: 'At home support', checked: false },
      { name: 'One-night shelter', checked: false },
      { name: 'Long-term shelter', checked: false },
    ],
  },

  'substance-use-resources': {
    label: 'Substance Use',
    types: [
      { name: 'See all', checked: false },
      { name: 'Wraparound', checked: false },
      { name: 'Healthier', checked: false },
      { name: 'Habits/Safer use', checked: false },
      { name: 'Meetings/Support', checked: false },
      { name: 'Residential', checked: false },
      { name: 'Treatment (Active medical mgtm, Passive medical mgtm', checked: false },
      { name: 'Medication treatment (Difference cirrhosis, AST/ALT > 200, anticoag', checked: false },
      { name: 'Safe place to sober up', checked: false },
      { name: 'Reward program', checked: false },
    ],
  },
};

export { serviceTypeData };
