import React from 'react';
import GDocEmbedPage from '../../components/ui/GDocEmbed/GDocEmbed';


export default class InternetAccess extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GDocEmbedPage
          pageHeader="Internet Access during the COVID-19 Emergency"
          GDocURL="https://docs.google.com/document/d/e/2PACX-1vTmf5Z0RiprdHr5r0Xw-1JMHF-YgOcDCSYxKaVtgqbKbSfnOmUG8140FIMwBtI4BgpqYjQ2SivnBLku/pub?embedded=false"
        />
      </React.Fragment>
    );
  }
}
