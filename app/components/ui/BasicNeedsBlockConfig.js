const BasicNeedsBlockConfig = {
  TITLE: {
    BEFORE_BLUE_WORD: 'Discover',
    BLUE_WORD: 'Basic Needs & Shelter',
    AFTER_BLUE_WORD: 'resources',
  },
  LINK: {
    QUERY_CATEGORY: 'Basic Needs & Shelter',
    TEXT: 'Browse resources',
  },
  CARDS: [
    {
      title: 'Apply for the shelter system',
      content: 'Get a 24-hour, weekend, or a 90 day bed in San Francisco',
      query: 'emergency+shelter',
      imgClass: 'basic-block-shelter',
    },
    {
      title: 'Free meals served daily',
      content: 'Get free food at 16 locations throughout the city',
      // TODO: open apps/assets/sf-free-eats_english.pdf on click instead of using this extra link
      // Ref: https://stackoverflow.com/questions/4735968/open-pdf-in-new-browser-full-window
      // It seems I would need to have the PDF served up from the backend
      query: null,
      resource: 'http://www.freeprintshop.org/download/eats_english.pdf',
      imgClass: 'basic-block-meals',
    },
    {
      // Add Pit Stop locations to search
      title: 'Public toilets and showers',
      content: 'Toilets, showers, sharps disposal, and pet waste collection',
      query: 'showers',
      imgClass: 'basic-block-showers',
    },
  ],
};

export default BasicNeedsBlockConfig;
