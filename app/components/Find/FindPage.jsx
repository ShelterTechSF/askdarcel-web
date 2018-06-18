import React from 'react';
import Footer from '../ui/Footer';
import Navigation from '../ui/Navigation';
import FindHeader from './FindHeader';
import CategoryItem from './CategoryItem';

let categories = [];

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
      <div>
        <FindHeader />
        <CategoryList categories={categories} />
      </div>
    );
  }
}

/* eslint-disable react/no-multi-comp */
class CategoryList extends React.Component {
  render() {
    const categoryNodes = this.props.categories.map(category => (
      <CategoryItem name={category.name} key={category.id} categoryid={category.id} />
      ));

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
