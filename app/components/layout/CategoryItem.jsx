import React from 'react';
import { Link } from 'react-router';
import { images } from '../../assets';

const categoryURL = name => `/search?refinementList[categories][0]=${encodeURIComponent(name)}`;

const CategoryItem = ({ name }) => (
  <li className="category-item">
    <Link className="category-button" to={categoryURL(name)}>
      <div className="category-button-content">
        <div className="category-button-icon">
          <img
            src={images.icon(name)}
            alt={name}
            className="img-responsive"
          />
        </div>
        <p className="category-button-title">{name}</p>
      </div>
    </Link>
  </li>
);

export default CategoryItem;
