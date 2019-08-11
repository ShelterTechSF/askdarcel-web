const LegalBlockConfig = {
  TITLE: {
    BEFORE_BLUE_WORD: 'Discover',
    BLUE_WORD: 'Legal',
    AFTER_BLUE_WORD: 'resources',
  },
  LINKS: [{
    QUERY_CATEGORY: 'Legal',
    TEXT: 'Browse resources',
  }],
  CARDS: [
    {
      title: 'Housing Advocacy',
      content: 'Eviction defense, housing help, homeownership',
      query: 'Housing+Law',
      imgClass: 'legal-block-housing',
    },
    {
      title: 'Immigration',
      content: 'Asylum, SIJS, DACA, T-Visas, U-Visas, VAWA',
      query: 'Immigration',
      imgClass: 'legal-block-immigration',
    },
    {
      title: 'Family & Relationships',
      content: 'Divorce, custody, guardianship, restraining order, T-Visas, etc.',
      query: 'Family+Law',
      imgClass: 'legal-block-family',
    },
  ],
};

export default LegalBlockConfig;
