/*
* @Author: dmyang
* @Date:   2015-07-31 15:49:32
* @Last Modified by:   dmyang
* @Last Modified time: 2015-07-31 15:54:51
*/

'use strict';

import 'react';

export default function getList(callback) {
    fetch('/api/list')
        .then((response) => response.text())
        .then((response) => {
            let list = response ? JSON.parse(response) : [];
            callback(null, list);
        })
        .catch(function(err) {
            console.error(err);
            callback(err);
        });
};
