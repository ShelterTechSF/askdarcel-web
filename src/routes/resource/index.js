/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Resource from './Resource';
import fetch from '../../core/fetch';

export const path = '/resource/:id';
export const action = async (state) => {
  const baseUrl = /* ENV.host || */ 'http://localhost:3000/resources';
  const queryUrl = baseUrl + '/?resource_id=' + state.params.id;

  const response = await fetch(queryUrl);
  const resourceObj = await response.json();
  
  state.context.onSetTitle('Resource');
  
  return <div>
  			<Resource resource={resourceObj} />
  			<h1>resource number: {state.params.id}</h1>;
		 </div>
};
