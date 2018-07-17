import React from 'react';
import { Link } from 'react-router';
import { images } from '../../assets';

class ListCategoryItem extends React.Component {
  render() {
    return (
      <li className="list-category-item">
        <Link className="list-category-button" to={`/search?refinementList[categories][0]=${this.props.name}`} >
          <div className="list-category-button-content">
            <p className="list-category-button-title">{this.props.name}</p>
          </div>
        </Link>
      </li>
    );
  }
}

export default ListCategoryItem;
