import React from 'react';
import Footer from '../ui/Footer';
import Navigation from '../ui/Navigation';
import WhiteLabel from '../ui/WhiteLabel';
import FindHeader from './FindHeader';
import CategoryItem from './CategoryItem';
import ListCategoryItem from './ListCategoryItem'

import './FindPage.scss';

let categories = [];
const subDomain = window.location.host.split('.')[0];

class CategoryBox extends React.Component {
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
      <div className="find-content-container">
        <FindHeader />
        <CategoryList categories={categories} />
      </div>
    );
  }
}

/* eslint-disable react/no-multi-comp */
class CategoryList extends React.Component {
  render() {
    const categoryNodes = [];
    const listCategoryNodes = [];

    this.props.categories.forEach((category) => {
      if (category.featured) {
        if (category.name === 'MOHCD Funded Services') {
          categoryNodes.unshift(
            <CategoryItem name={category.name} key={category.id} categoryid={category.id} />
          );
        } else {
          categoryNodes.push(
            <CategoryItem name={category.name} key={category.id} categoryid={category.id} />
          );
        }
      } else {
        listCategoryNodes.push(
          <ListCategoryItem name={category.name} key={category.id} categoryid={category.id} />
        );
      }
    });

    return (
      <section className="category-list" role="main">
        <ul className="category-items"> {categoryNodes} </ul>
        <ul className="list-category-items"> {listCategoryNodes} </ul>
      </section>
    );
  }
}

class ContentPage extends React.Component {
  render() {
    return (
      <div className="find-page">
        <Navigation />
        <CategoryBox />
          { subDomain === CONFIG.MOHCD_SUBDOMAIN ? <WhiteLabel /> : null}
        <Footer />
      </div>
    );
  };
};

export default ContentPage;
