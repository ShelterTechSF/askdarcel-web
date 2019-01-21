import React from 'react';
import CategoryItem from './CategoryItem';
import ListCategoryItem from './ListCategoryItem';

/* eslint-disable react/no-multi-comp */
export class CategoryList extends React.Component {
  render() {
    const categoryNodes = [];
    const listCategoryNodes = [];

    this.props.categories.forEach(category => {
      if (category.featured) {
        if (category.name === 'MOHCD Funded Services') {
          categoryNodes.unshift(
            <CategoryItem name={category.name} key={category.id} categoryid={category.id} />,
          );
        } else {
          categoryNodes.push(
            <CategoryItem name={category.name} key={category.id} categoryid={category.id} />,
          );
        }
      } else {
        listCategoryNodes.push(
          <ListCategoryItem name={category.name} key={category.id} categoryid={category.id} />,
        );
      }
    });

    return (
      <section className="category-list" role="main">
        <div className="featured-categories">
          <span>Discover resources by category</span>
          <ul className="category-items"> {categoryNodes} </ul>
        </div>
        <ul className="list-category-items"> {listCategoryNodes} </ul>
      </section>
    );
  }
}
