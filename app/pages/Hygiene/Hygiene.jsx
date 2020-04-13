import React from 'react';
import GDocEmbedPage from '../../components/ui/GDocEmbed/GDocEmbed';


export default class Hygiene extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GDocEmbedPage
          pageHeader="Hygiene resources for the COVID-19 Emergency"
          GDocURL="https://docs.google.com/document/d/e/2PACX-1vSsqCdzEf9ulqX64cSvWiq-T877DLvhNZ9jXjepMT51M6qYqqKbGg1pObo2GnuWELTv5_jzfYi2ZbEH/pub?embedded=false"
        />
      </React.Fragment>
    );
  }
}
