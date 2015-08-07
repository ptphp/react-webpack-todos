/*
* @Author: dmyang
* @Date:   2015-07-30 00:58:35
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-07 14:05:20
*/

'use strict';

import '../scss/base.scss';
import '../scss/app.scss';

import React from 'react';

import App from './view/app';

window.addEventListener('load', () => {
    React.render((<App />), document.body);
});
