import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import * as ax from 'axios';

import Footer from 'components/ui/Footer/Footer';
import Partners from 'components/ui/Partners/Partners';
import heroBackground from 'assets/img/HomePage/hero-background.svg';

import CategoryList from './components/CategoryList';
import HomePageHero from './components/HomePageHero';
import SearchBar from './components/SearchBar';
import Section from './components/Section';


import './HomePage.scss';


const VerticalSpacing = ({ spacing }) => (
  <div style={{ height: spacing }} />
);

VerticalSpacing.propTypes = {
  spacing: PropTypes.string.isRequired,
};


export default class HomePage extends React.Component {
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
    if (searchValue) {
      browserHistory.push({
        pathname: '/search',
        query: { query: searchValue },
      });
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
          title="Find social services in San Francisco"
          description="Discover housing, homelessness, legal, and many more free and reduced cost social services near you"
          imageURL={heroBackground}
        />
        <Section
          title="Guided Pathways"
          description="Need help but not sure where to start? Try one of our guided pathways."
        >
          {/* TODO: Insert Guided Pathways component here */}
        </Section>
        <Section
          title="Browse Directory"
          description="Looking for a specific organization? Search the directory or browse by category."
        >
          <SearchBar
            placeholder={`Search ${resourceCount || ''} resources in San Francisco`}
            onSubmit={this.submitSearch}
            onChange={newSearchValue => this.setState({ searchValue: newSearchValue })}
            value={searchValue}
          />
          <VerticalSpacing spacing="40px" />
          <CategoryList categories={categories} />
        </Section>
        <Partners />
        <Footer />
      </div>
    );
  }
}
