import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { images } from '../../../../assets';

import styles from './CategoryList.scss';

const categoryURL = name => `/search?refinementList[categories][0]=${encodeURIComponent(name)}`;

const CategoryType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
});

const CategoryCard = ({ category }) => (
  <Link className={styles.cardLink} to={categoryURL(category.name)}>
    <div className={styles.card}>
      <div className={styles.cardIconWrapper}>
        <img
          className={styles.cardIcon}
          src={images.icon(category.name)}
          alt={category.name}
        />
      </div>
      <div className={styles.cardTextWrapper}>
        <div className={styles.cardText}>
          {category.name}
        </div>
      </div>
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
