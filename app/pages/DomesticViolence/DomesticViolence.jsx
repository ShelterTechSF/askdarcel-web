import React from 'react';
import GDocEmbedPage from '../../components/ui/GDocEmbed/GDocEmbed';


export default class DomesticViolence extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GDocEmbedPage
          pageHeader="Domestic Violence help for the COVID-19 Emergency"
          GDocURL="https://docs.google.com/document/d/e/2PACX-1vSGs3HcU1JNl6eCvQrQAy9kcbgLoZW9KUU2-IXE6chcOTvs_aV_PuzwH9A5QWeZ8lO-u1qAwzdqQrID/pub?embedded=false"
        />
      </React.Fragment>
    );
  }
}
