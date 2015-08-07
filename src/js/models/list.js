/*
* @Author: dmyang
* @Date:   2015-07-31 15:49:32
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-07 14:05:00
*/

'use strict';

import React from 'react';

export default function getList(callback) {
    let api = '/api/list';

    fetch(api)
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
