/*
* @Author: dmyang
* @Date:   2015-07-30 00:58:35
* @Last Modified by:   dmyang
* @Last Modified time: 2015-07-31 21:22:39
*/

'use strict';

import '../scss/base.scss';
import '../scss/app.scss';

import React from 'react';
import App from './view/app';

// import getList from './models/list';

// getList(function(err, data) {
//     if(err) throw err;

//     // console.log(data);

//     React.render((
//         <App list={data} />
//     ), document.body);
// });

window.addEventListener('load', () => {
    React.render((<App />), document.body);
});
