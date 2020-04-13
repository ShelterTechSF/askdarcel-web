import React from 'react';
import GDocEmbedPage from '../../components/ui/GDocEmbed/GDocEmbed';

export default class RentalAssistance extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GDocEmbedPage
          pageHeader="Rental Assistance for the COVID-19 Emergency"
          GDocURL="https://docs.google.com/document/d/e/2PACX-1vQrdPtbc6EKPs8X81xu2X8bu8LC-ke2jBEiENImAoLUiSWoOMIRqa1hlneiiCoGDBBOwyR9RHVKlrJe/pub?embedded=false"
        />
      </React.Fragment>
    );
  }
}
