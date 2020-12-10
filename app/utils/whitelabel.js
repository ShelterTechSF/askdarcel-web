import config from '../config';

/** Whether we should display the SF Service Guide branded version of the site */
const isSFServiceGuideSite = () => window.location.host.indexOf(config.MOHCD_DOMAIN) > -1;
const isSFFamiliesSite = () => window.location.host.indexOf(config.SFFAMILIES_DOMAIN) > -1;
const getSiteTitle = () => {
	if (isSFServiceGuideSite()) {
		return 'SF Service Guide';
	} else if (isSFFamiliesSite()) {
		return 'SF Families';
	} else {
		return 'AskDarcel';
	}
};

export { isSFServiceGuideSite, isSFFamiliesSite, getSiteTitle };
