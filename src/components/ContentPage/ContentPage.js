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
import s from './ContentPage.scss';

var resources = [];
var categories = [];
var data = {};
      
var CommentBox = React.createClass({
  loadCategoriesFromServer: function() {  
    var callback = function callback(response, textStatus, jqXHR) {
      if (httpRequest.status === 200) {
        categories = JSON.parse(response.srcElement.response);
        this.setState({categories: categories});
        console.log(categories)
      } else {
        console.log('error...');
      }
    }.bind(this);

    var tempUrl = 'http://localhost:3000/categories';
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', tempUrl, true);
    httpRequest.onreadystatechange = callback;
    httpRequest.send(null);
  },

  loadResourcesFromServer: function() {  
    var callback = function callback(response, textStatus, jqXHR) {
      if (httpRequest.status === 200) {
        resources = JSON.parse(response.srcElement.response);
        this.setState({data: resources});
      } else {
        console.log('error...');
      }
    }.bind(this);

    var tempUrl = 'http://localhost:3000/resources';
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', tempUrl, true);
    httpRequest.onreadystatechange = callback;
    httpRequest.send(null);
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    console.log('hi!')
    this.loadResourcesFromServer();
    this.loadCategoriesFromServer();
  },

  render: function() {
    return (
      <div className="shelterBox">
          <h1>Resources</h1>
          <CommentList data={resources} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(resource) {
      return (
        <Comment name={resource.name} key={resource.id} desc={resource.short_description}>
          {resource.short_description}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var Comment = React.createClass({

  render: function() {
    return  (
      <li className="comment">
        <p className="commentname">
          <bold>{this.props.name} </bold> 
          <span>{this.props.desc}</span>
        </p>
          {this.props.status}
      </li>
    );
  }
});

class ContentPage extends Component {


  render() {
    return (
      
      <CommentBox url="/api/comments"/>
    );
  }

}

export default withStyles(ContentPage, s);
