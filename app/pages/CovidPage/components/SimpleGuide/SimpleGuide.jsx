import React from 'react';
import PropTypes from 'prop-types';

import { CovidHeader } from '../CovidHeader';
import { GoogleDocEmbed } from '../GoogleDocEmbed';

/** A simple guide page that only consists of the common header and Google Doc
 * embed.
 */
export const SimpleGuide = ({ pageHeader, googleDocURL }) => (
  <article>
    <CovidHeader headerText={pageHeader} />
    <GoogleDocEmbed title={pageHeader} embedURL={googleDocURL} />
  </article>
);

SimpleGuide.propTypes = {
  pageHeader: PropTypes.string.isRequired,
  googleDocURL: PropTypes.string.isRequired,
};
