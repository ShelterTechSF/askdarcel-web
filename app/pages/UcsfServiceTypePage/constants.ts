interface UcsfCategory {
  id: string;
}

interface UcsfServiceTypeDictionary {
  [key: string]: UcsfCategory;
}

const constants: UcsfServiceTypeDictionary = {
  'ucsf-mental-health-resources': {
    id: '2000001',
  },

  'ucsf-shelter-resources': {
    id: '2000002',
  },

  'ucsf-substance-use-resources': {
    id: '2000003',
  },
};

export { constants };
