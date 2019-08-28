const HousingBlockConfig = {
  TITLE: {
    BEFORE_BLUE_WORD: 'Discover',
    BLUE_WORD: 'Housing',
    AFTER_BLUE_WORD: 'resources',
  },
  CARDS: [
    {
      title: 'Housing Counseling',
      content: 'Talk with a housing counselor to explore your options',
      query: 'Housing+Counselor',
      imgClass: 'housing-block-counseling',
    },
    {
      title: 'Housing Subsidies',
      content: 'Get help paying your mortgage, rent, or deposit',
      query: 'Housing+Subsidies',
      imgClass: 'housing-block-subsidies',
    },
    {
      title: 'DAHLIA SF Housing Portal',
      content: 'Apply for affordable housing to rent or to buy',
      query: null,
      resource: 'https://housing.sfgov.org/',
      imgClass: 'housing-block-dahlia',
    },
  ],
};

export default HousingBlockConfig;
