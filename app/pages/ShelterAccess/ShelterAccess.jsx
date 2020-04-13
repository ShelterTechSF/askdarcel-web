import React from 'react';
import GDocEmbedPage from '../../components/ui/GDocEmbed/GDocEmbed';


export default class ShelterAccess extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GDocEmbedPage
          pageHeader="Shelter Access Points for the COVID-19 Emergency"
          GDocURL="https://docs.google.com/document/d/e/2PACX-1vTFNbKZUYxKBW9qX-gDWOTKHrO7enuIK4OuymWGJxQ1ypELhqo6BvQV8Gg4E_QtpuEMvHlzY6e058so/pub?embedded=false"
        />
      </React.Fragment>
    );
  }
}
