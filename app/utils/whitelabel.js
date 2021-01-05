import config from '../config';

/** Whether we should display the SF Service Guide branded version of the site */
const isSFFamiliesSite = () => window.location.host.indexOf(config.SFFAMILIES_DOMAIN) > -1;
const isSFServiceGuideSite = () => !isSFFamiliesSite()
  && window.location.host.indexOf(config.MOHCD_DOMAIN) > -1;
const getSiteTitle = () => {
  if (isSFServiceGuideSite()) {
    return 'SF Service Guide';
  }
  if (isSFFamiliesSite()) {
    return 'SF Families';
  }
  return 'AskDarcel';
};
const getSiteUrl = () => {
  if (isSFServiceGuideSite()) {
    return 'https://sfserviceguide.org';
  }
  if (isSFFamiliesSite()) {
    return 'https://sffamilies.sfserviceguide.org/';
  }
  return 'https://askdarcel.org';
};

export {
  isSFServiceGuideSite, isSFFamiliesSite, getSiteTitle, getSiteUrl,
};
