import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as ax from 'axios';
import qs from 'qs';

import Footer from 'components/ui/Footer/Footer';
import Partners from 'components/ui/Partners/Partners';
import CategoryList from './components/CategoryList';
import HomePageHero from './components/HomePageHero';
import SearchBar from './components/SearchBar';
import Guidelist from './components/GuideList';
import Section from './components/Section';


const VerticalSpacing = ({ spacing }) => (
  <div style={{ height: spacing }} />
);

VerticalSpacing.propTypes = {
  spacing: PropTypes.string.isRequired,
};


class HomePage extends React.Component {
  state = {
    categories: [],
    resourceCount: undefined,
    searchValue: '',
  };

  componentDidMount() {
    this.loadCategoriesFromServer();
    this.loadResourceCountFromServer();
  }

  submitSearch = () => {
    const { searchValue } = this.state;
    const { history } = this.props;
    if (searchValue) {
      const query = qs.stringify({ query: searchValue });
      history.push(`/search?${query}`);
    }
  }

  loadCategoriesFromServer() {
    ax.get('/api/categories/featured').then(resp => {
      this.setState({ categories: resp.data.categories });
    });
  }

  loadResourceCountFromServer() {
    ax.get('/api/resources/count').then(resp => {
      this.setState({ resourceCount: resp.data });
    });
  }

  render() {
    const {
      categories, resourceCount, searchValue,
    } = this.state;
    return (
      <div className="find-page">
        <HomePageHero
          title="Welcome to the SF Service Guide"
          description="Find food, housing, health resources and more in San Francisco."
        />
        <Section
          title="Resource Guides"
          description="Get guided help with many of the most common issues people are facing in San Francisco. Updated April 12, 2020."
        >
          <Guidelist />
        </Section>
        <Section
          title="Browse Directory"
          description="Search the directory for a specific social service provider or browse by category."
        >
          <SearchBar
            placeholder={`Search ${resourceCount || ''} resources in San Francisco`}
            onSubmit={this.submitSearch}
            onChange={newSearchValue => this.setState({ searchValue: newSearchValue })}
            value={searchValue}
          />
          <CategoryList categories={categories} />
        </Section>
        <Partners />
        <Footer />
      </div>
    );
  }
}

export default withRouter(HomePage);
