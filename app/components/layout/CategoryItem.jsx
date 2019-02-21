import React from 'react';
import { Link } from 'react-router';
import { images } from '../../assets';

class CategoryItem extends React.Component {
  render() {
    const url = `/search?refinementList[categories][0]=${encodeURIComponent(this.props.name)}`;
    return (
      <li className="category-item">
        <Link className="category-button" to={url} >
          <div className="category-button-content">
            <div className="category-button-icon">
              <img
                src={images.icon(this.props.name)}
                alt={this.props.name}
                className="img-responsive"
              />
            </div>
            <p className="category-button-title">{this.props.name}</p>
          </div>
        </Link>
      </li>
    );
  }
}

export default CategoryItem;
