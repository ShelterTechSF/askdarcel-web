/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CategoryPage.scss';

var categories = [];
      
var CategoryBox = React.createClass({
  loadCategoriesFromServer: function() {  
    var callback = function callback(response, textStatus, jqXHR) {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          categories = JSON.parse(httpRequest.responseText);
          this.setState({categories: categories});
        } else {
          console.log('error...');
        }
      }
    }.bind(this);

    var tempUrl = 'http://localhost:3000/categories';
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', tempUrl, true);
    httpRequest.onreadystatechange = callback;
    httpRequest.send(null);
  },

  componentDidMount: function() {
    this.loadCategoriesFromServer();
  },

  render: function() {
    return (
      <div className={s.shelterBox}>
          <CategoryList categories={categories} />
      </div>
    );
  }
});

var CategoryList = React.createClass({
  render: function() {
  
    var categoryNodes = this.props.categories.map(function(category) {
      return (
        <Category name={category.name} key={category.id} />
      );
    });
    
    return (
      <div className="CategoryList"> 
        <p className={s.category_title}>Select a category:</p>
        <ul className={s.category_list}>
          {categoryNodes}
        </ul>
      </div>
    );
  }
});

var Category = React.createClass({
  render: function() {
    return  (
      <li className={s.category_list_item}>
        <p className="categoryname">
          <bold>{this.props.name} </bold> 
        </p>
      </li>
    );
  }
});

class ContentPage extends Component {
  render() {
    return (
      <CategoryBox />
    );
  }

}

export default withStyles(ContentPage, s);
