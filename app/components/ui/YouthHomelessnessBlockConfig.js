import YouthCaseyPdf from '../../assets/casey-youth-poster.pdf';

const YouthHomelessnessBlockConfig = {
  TITLE: {
    BLUE_WORD: 'Youth Homelessness Guide',
    DESCRIPTION: 'Read our step-by-step guide unique to people age 18-24 to help you best navigate homelessness resources available to you',
  },
  CAROUSEL: {
    NUM_SLOTS: 4,
  },
  LINKS: [
    {
      URL: 'https://help.sfserviceguide.org/en/collections/1669738-youth-homelessness-guide',
      TEXT: 'View Guide',
    },
    {
      URL: `${YouthCaseyPdf}`,
      TEXT: 'Youth Guide',
    },
  ],
  CARDS: [
    {
      title: 'Step 1: Find Temporary Housing',
      query: null,
      resource: 'https://help.sfserviceguide.org/youth-homelessness-guide/step-1-find-temporary-housing',
    },
    {
      title: 'Step 2: Gather Necessary Documents',
      query: null,
      resource: 'https://help.sfserviceguide.org/youth-homelessness-guide/step-2-gather-necessary-documents',
    },
    {
      title: 'Step 3: Apply for Transitional Housing',
      query: null,
      resource: 'https://help.sfserviceguide.org/youth-homelessness-guide/step-3-apply-for-transitional-housing-right-away',
    },
    {
      title: 'Step 4: Apply for Government Benefits',
      query: null,
      resource: 'https://help.sfserviceguide.org/youth-homelessness-guide/step-4-apply-for-government-benefits',
    },
    {
      title: 'Step 5: Apply for Jobs or Vocational Training',
      query: null,
      resource: 'https://help.sfserviceguide.org/en/collections/1669738-youth-homelessness-guide',
    },
    {
      title: 'Other Helpful Services',
      query: null,
      resource: 'https://help.sfserviceguide.org/en/articles/2868666-other-helpful-services',
    },
  ],
  NUM_SHOWN_CARDS: 4,
};

export default YouthHomelessnessBlockConfig;
