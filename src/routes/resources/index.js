/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Resources from './Resources';
import fetch from '../../core/fetch';

export const path = '/resources/:id';
export const action = async (state) => {
  // const response = await fetch('/graphql?query={news{title,link,contentSnippet}}');
  // const { data } = await response.json();
  var baseUrl = /* ENV.host || */ 'http://localhost:3000/resources';
  var queryUrl = baseUrl + '/?category_id=' + state.params.id;

  fetch(queryUrl, {method: 'get'})
  .then(function(resp){
  	return resp.json();
  })
  .then(function(resp) {
  	console.log(resp)
  });
  
  state.context.onSetTitle('Resources');
  return <h1>resources {state.params.id}</h1>;
};
