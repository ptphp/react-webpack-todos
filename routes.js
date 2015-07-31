/*
* @Author: dmyang
* @Date:   2015-07-31 11:41:38
* @Last Modified by:   dmyang
* @Last Modified time: 2015-07-31 12:09:47
*/

'use strict';

var proxy = require('koa-proxy');

var list = require('./mock/list');

module.exports = function(router) {
    router.get('/api/list', function*() {
        this.body = list;
    });
};
