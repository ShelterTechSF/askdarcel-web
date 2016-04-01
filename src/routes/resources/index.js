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
  state.context.onSetTitle('Resources');
  return <Resources categoryid={state.params.id}/>;
};
