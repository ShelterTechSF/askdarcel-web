import React from 'react';
import GDocEmbedPage from '../../components/ui/GDocEmbed/GDocEmbed';


export default class MedicalServices extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GDocEmbedPage
          pageHeader="Medical Services for the COVID-19 Emergency"
          GDocURL="https://docs.google.com/document/d/e/2PACX-1vSqkfARenUcIZRff8NHBtIhIdyWoqEcdtMyN1KvsCFoTlgFoQ_zj_tSBesQWxqoAsBP4iqCcbACN8-j/pub?embedded=false"
        />
      </React.Fragment>
    );
  }
}
