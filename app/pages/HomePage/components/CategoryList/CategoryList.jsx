import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './CategoryList.scss';

const categoryURL = name => `/search?refinementList[categories][0]=${encodeURIComponent(name)}`;

const CategoryType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
});

const CategoryCard = ({ category }) => (
  <Link className={styles.cardLink} to={categoryURL(category.name)}>
    <div className={styles.card}>
      <p className={styles.cardText}>
        {category.name}
      </p>
    </div>
  </Link>
);

CategoryCard.propTypes = {
  category: CategoryType.isRequired,
};


const CategoryList = ({ categories }) => (
  <div className={styles.wrapper}>
    <ul className={styles.list}>
      { categories.map(category => (
        <li className={styles.item} key={category.id}>
          <CategoryCard category={category} />
        </li>
      ))}
    </ul>
  </div>
);

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(CategoryType).isRequired,
};

export default CategoryList;
