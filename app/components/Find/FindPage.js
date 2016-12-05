import React, { Component, PropTypes } from 'react';
import Footer from '../Footer.js'
import Navigation from '../Navigation.js'
import FindHeader from './FindHeader.js'
import CategoryItem from './CategoryItem.js'

var categories = [];

var CategoryBox = React.createClass({
  loadCategoriesFromServer: function() {
    var callback = function callback(response, textStatus, jqXHR) {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          categories = JSON.parse(httpRequest.responseText).categories;
          this.setState({categories: categories});
        } else {
          console.log('error...');
        }
      }
    }.bind(this);

    var tempUrl = '/api/categories';
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', tempUrl, true);
    httpRequest.onreadystatechange = callback;
    httpRequest.send(null);
  },

  componentDidMount: function() {
    this.loadCategoriesFromServer();
  },

  render: function() {
    return (
      <div>
        <FindHeader />
        <CategoryList categories={categories} />
      </div>
    );
  }
});

var CategoryList = React.createClass({
  render: function() {

    var categoryNodes = this.props.categories.map(function(category) {
      return (
        <CategoryItem name={category.name} key={category.id} categoryid={category.id} />
      );
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
  }
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
