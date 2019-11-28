import config from '../config';

/** Whether we should display the SF Service Guide branded version of the site */
const isSFServiceGuideSite = () => window.location.host.indexOf(config.MOHCD_DOMAIN) > -1;
const getSiteTitle = () => (isSFServiceGuideSite() ? 'SF Service Guide' : 'AskDarcel');

export { isSFServiceGuideSite, getSiteTitle };
