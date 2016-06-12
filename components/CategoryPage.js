
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Gmap from './Resources/Map.js';
import LargeHeader from './LargeHeader.js'
import Footer from './Footer.js'

var categories = [];

var CategoryBox = React.createClass({
  loadCategoriesFromServer: function() {
    var callback = function callback(response, textStatus, jqXHR) {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          categories = JSON.parse(httpRequest.responseText);
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
        <LargeHeader />
        <CategoryList categories={categories} />
        <Footer />
      </div>
    );
  }
});

var CategoryList = React.createClass({
  render: function() {

    var categoryNodes = this.props.categories.map(function(category) {
      return (
        <Category name={category.name} key={category.id} categoryid={category.id} image_path={category.image_path}/>
      );
    });

    return (
      <section className="category-list" role="main">
        <header>
          <h3>Browse Categories</h3>
        </header>
        <ul className="category-items">
          {categoryNodes}
        </ul>
      </section>
    );
  }
});

var Category = React.createClass({
  render: function() {
    return  (
    <li className="category-item">
      <Link className="category-button" to={{ pathname: "resources", query: { categoryid: this.props.categoryid } }} >
        <div className="category-button-content">
          <img src={'assets/images/' + this.props.image_path} alt="category_image" className="img-responsive"/>
          <h5 className="category-button-title">{this.props.name}</h5>
        </div>
      </Link>
    </li>
    );
  }
});

class ContentPage extends Component {
  render() {
    return (
      <CategoryBox />
    );
  }

}

export default ContentPage;
