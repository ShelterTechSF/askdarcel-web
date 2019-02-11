import React from 'react';
import CategoryItem from './CategoryItem';

/* eslint-disable react/no-multi-comp */
export class CategoryList extends React.Component {
  render() {
    const categoryNodes = this.props.categories.map(category => (
      <CategoryItem name={category.name} key={category.id} categoryid={category.id} />
    ));

    return (
      <section className="category-list" role="main">
        <div className="featured-categories">
          <h2 className="featured-categories__title">Discover resources by category</h2>
          <ul className="category-items"> {categoryNodes} </ul>
        </div>
      </section>
    );
  }
}
