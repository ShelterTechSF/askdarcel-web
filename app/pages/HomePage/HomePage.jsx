import React from 'react';
import Footer from 'components/ui/Footer/Footer';
import LandingPageResourceBlock from 'components/ui/LandingPageResourceBlock/LandingPageResourceBlock';
import LandingPageEligibilityBlock from 'components/ui/LandingPageEligibilityBlock';
import Partners from 'components/ui/Partners/Partners';
import FindHeader from 'components/layout/FindHeader';
import { CategoryList } from 'components/layout/CategoryList';
import HousingBlockConfig from 'components/ui/LandingPageResourceBlock/HousingBlockConfig';
import BasicNeedsBlockConfig from 'components/ui/LandingPageResourceBlock/BasicNeedsBlockConfig';
import LegalBlockConfig from 'components/ui/LandingPageResourceBlock/LegalBlockConfig';
import YouthHomelessnessBlockConfig from 'components/ui/LandingPageResourceBlock/YouthHomelessnessBlockConfig';
import HomelessnessBlockConfig from 'components/ui/LandingPageResourceBlock/HomelessnessBlockConfig';
import * as ax from 'axios';

import './HomePage.scss';

export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      eligibilities: [],
    };
  }

  componentDidMount() {
    this.loadCategoriesFromServer();
    this.loadEligibilitiesFromServer();
  }

  loadCategoriesFromServer() {
    ax.get('/api/categories/featured').then(resp => {
      this.setState({ categories: resp.data.categories });
    });
  }

  loadEligibilitiesFromServer() {
    // TODO Should probably move this and above into redux
    ax.get('/api/eligibilities/featured').then(resp => {
      this.setState({ eligibilities: resp.data.eligibilities });
    });
  }

  render() {
    const { categories, eligibilities } = this.state;
    return (
      <div className="find-page">
        <div className="find-content-container">
          <FindHeader />
          <CategoryList categories={categories} />
        </div>
        <LandingPageEligibilityBlock eligibilities={eligibilities} />
        <LandingPageResourceBlock config={HousingBlockConfig} />
        <LandingPageResourceBlock config={LegalBlockConfig} />
        <LandingPageResourceBlock config={BasicNeedsBlockConfig} />
        <LandingPageResourceBlock config={YouthHomelessnessBlockConfig} />
        <LandingPageResourceBlock config={HomelessnessBlockConfig} />
        <Partners />
        <Footer />
      </div>
    );
  }
}
