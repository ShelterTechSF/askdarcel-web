import React from 'react';
import GDocEmbedPage from '../../components/ui/GDocEmbed/GDocEmbed';


// Disable max line length rule, since this file is mostly just text-heavy HTML
// content.
/* eslint-disable max-len */

export default class Covid extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GDocEmbedPage
          pageHeader="Coronavirus resources for Individuals-In-Need"
          GDocURL="https://docs.google.com/document/d/e/2PACX-1vTGpgLJDTg3sm2XhyBoNUTNUhqJjTt5lEp8IXSP_yBNrxVgZ_zkmdKPo7JcKJTbduoTRt_dYnRV9xTB/pub?embedded=false"
        />
      </React.Fragment>
    );
  }
}
