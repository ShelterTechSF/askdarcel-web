import React, { Component } from 'react';
import Footer from '../Footer.js';
import Navigation from '../Navigation';
import FindHeader from './FindHeader';
import CategoryItem from './CategoryItem';
import { get } from '../../utils/DataService';

const categories = [];

const CategoryBox = React.createClass({
  loadCategoriesFromServer() {
    // var callback = function callback(response, textStatus, jqXHR) {
    //   if (httpRequest.readyState === XMLHttpRequest.DONE) {
    //     if (httpRequest.status === 200) {
    //       categories = JSON.parse(httpRequest.responseText).categories;
    //       this.setState({categories: categories});
    //     } else {
    //       console.log('error...');
    //     }
    //   }
    // }.bind(this);

    get('/api/categories?top_level=true').then((resp) => {
      console.log(this, resp)
      this.setState({ categories: resp.categories });
    });
    // var tempUrl = '/api/categories?top_level=true';
    // var httpRequest = new XMLHttpRequest();
    // httpRequest.open('GET', tempUrl, true);
    // httpRequest.onreadystatechange = callback;
    // httpRequest.send(null);
  },

  componentDidMount() {
    this.loadCategoriesFromServer();
  },

  render() {
    return (
      <div>
        <FindHeader />
        <CategoryList categories={categories} />
      </div>
    );
  },
});

const CategoryList = React.createClass({
  render() {
    let categoryNodes = this.props.categories.map((category) => {
      <CategoryItem name={category.name} key={category.id} categoryid={category.id} />
    });

    return (
      <section className="category-list" role="main">
        <header>
          <h2>Most used resources</h2>
        </header>
        <ul className="category-items">
          {categoryNodes}
        </ul>
      </section>
    );
  },
});

class ContentPage extends Component {
  render() {
    return (
      <div className="find-page">
        <Navigation />
        <CategoryBox />
        <Footer />
      </div>
    );
  }
}

export default ContentPage;
