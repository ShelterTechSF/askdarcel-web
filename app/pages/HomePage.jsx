import React from 'react';
import Footer from 'components/ui/Footer';
import Navigation from 'components/ui/Navigation';
import WhiteLabel from 'components/ui/WhiteLabel';
import FindHeader from 'components/layout/FindHeader';
import { CategoryList } from 'components/layout/CategoryList';
import config from '../config';

import './HomePage.scss';

let categories = [];
const subDomain = window.location.host.split('.')[0];

class HomePage extends React.Component {
  componentDidMount() {
    this.loadCategoriesFromServer();
  }

  loadCategoriesFromServer() {
    const httpRequest = new XMLHttpRequest();
    const tempUrl = '/api/categories?top_level=true';

    const callback = function callback() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          categories = JSON.parse(httpRequest.responseText).categories;
          this.setState({ categories });
        } else {
          console.log('error...');
        }
      }
    }.bind(this);

    httpRequest.open('GET', tempUrl, true);
    httpRequest.onreadystatechange = callback;
    httpRequest.send(null);
  }

  render() {
    return (
      <div className="find-page">
        <Navigation />
        <div className="find-content-container">
          <FindHeader />
          <CategoryList categories={categories} />
        </div>
        {subDomain === config.MOHCD_SUBDOMAIN ? <WhiteLabel /> : null}
        <Footer />
      </div>
    );
  }
}

export default HomePage;
