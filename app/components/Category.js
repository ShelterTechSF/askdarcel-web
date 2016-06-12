import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

var icons = require.context("../assets/images", true, /ic-.*\.png$/i);
var iconPathMap = {};
icons.keys().forEach(function (key) {
  iconPathMap[key.replace('./', '')] = icons(key);
});

var Category = React.createClass({
  render: function() {
    return (
    <li className="category-item">
      <Link className="category-button" to={{ pathname: "resources", query: { categoryid: this.props.categoryid } }} >
        <div className="category-button-content">
          <img src={iconPathMap[this.props.image_path]} alt={this.props.name} className="img-responsive"/>
          <h5 className="category-button-title">{this.props.name}</h5>
        </div>
      </Link>
    </li>
    );
  }
});

export default Category;

