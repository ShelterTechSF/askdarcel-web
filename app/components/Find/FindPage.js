import React from 'react';
import Footer from '../ui/Footer';
import Navigation from '../ui/Navigation';
import FindHeader from './FindHeader';
import CategoryItem from './CategoryItem';

var categories = [];

class CategoryBox extends React.Component {
  componentDidMount() {
    this.loadCategoriesFromServer();
  }

  loadCategoriesFromServer() {
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

    var tempUrl = '/api/categories?top_level=true';
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', tempUrl, true);
    httpRequest.onreadystatechange = callback;
    httpRequest.send(null);
  }

  render() {
    return (
      <div>
        <FindHeader />
        <CategoryList categories={categories} />
      </div>
    );
  }
}

class CategoryList extends React.Component {
  render() {

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
}

class ContentPage extends React.Component {
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
