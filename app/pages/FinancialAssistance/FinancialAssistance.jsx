import React from 'react';
import GDocEmbedPage from '../../components/ui/GDocEmbed/GDocEmbed';


export default class FinancialAssistance extends React.Component {
  render() {
    return (
      <React.Fragment>
        <GDocEmbedPage
          pageHeader="Financial and Job Assistance for the COVID-19 Emergency "
          GDocURL="https://docs.google.com/document/d/e/2PACX-1vQ76IDYnl7rpCdyCf1Jk6cbxO240gzaVmUAWUMNi8nAyTgqrbJKxDK0bv1QWHNcNBQ79cUHq_NvBJko/pub?embedded=false"
        />
      </React.Fragment>
    );
  }
}
