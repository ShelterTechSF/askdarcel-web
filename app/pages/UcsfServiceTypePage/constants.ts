// We are hardcoding the eligibility data as it currently exists on the design specs.
// When content has entered UCSF specific eligibilities, will we fetch that data from the API

interface UcsfCategory {
  id: string;
}

interface UcsfServiceTypeDictionary {
  [key: string]: UcsfCategory;
}

const constants: UcsfServiceTypeDictionary = {
  'mental-health-resources': {
    id: '2000001',
  },

  'shelter-resources': {
    id: '2000002',
  },

  'substance-use-resources': {
    id: '2000003',
  },
};

export { constants };
