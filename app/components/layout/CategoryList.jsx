import React from 'react';
import CategoryItem from './CategoryItem';

export const CategoryList = ({ categories }) => (
  <section className="category-list" role="main">
    <div className="featured-categories">
      <h2 className="featured-categories__title">Discover resources by category</h2>
      <ul className="category-items">
        {categories.map(category => (
          <CategoryItem name={category.name} key={category.id} categoryid={category.id} />))}
      </ul>
    </div>
  </section>
);
