/**
 * @Author: dmyang
 * @Date:   2015-06-29 18:42:30
 * @Last Modified by:   dmyang
 * @Last Modified time: 2015-07-31 12:09:29
 */

'use strict';

// load native modules
var http = require('http');
var path = require('path');

// load 3rd modules
var koa = require('koa');
var router = require('koa-router')();
var render = require('koa-ejs');
var serve = require('koa-static');
var colors = require('colors');

// load local modules
var pkg = require('./package.json');
var env = process.env.NODE_ENV;
var debug = !env || env === 'development';
var viewDir = debug ? 'src' : 'assets';

// load routes
var routes = require('./routes');

// init framework
var app = koa();

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

// basic settings
app.keys = [pkg.name, pkg.description];
app.proxy = true;

// template engine settings
render(app, {
    root: path.resolve(__dirname, './' + viewDir + '/'),
    // cache: false,
    cache: debug ? false : true,
    // debug: true,
    debug: debug ? true : false,
    layout: false,
    viewExt: 'html',
    locals: {
        env: env
    }
});

// global events listen
app.on('error', function(err, ctx) {
    err.url = err.url || ctx.request.url;
    console.error(err, ctx);
});

// handle favicon.ico
app.use(function*(next) {
    if (this.url.match(/favicon\.ico$/)) this.body = '';
    yield next;
});

// logger
app.use(function*(next) {
    console.log(this.method.info, this.url);
    yield next;
});

// use routes
routes(router);
app.use(router.routes());

if (debug) {
    var webpackDevMiddleware = require('koa-webpack-dev-middleware');
    var webpack = require('webpack');
    var webpackDevConf = require('./webpack-dev.config');

    app.use(webpackDevMiddleware(webpack(webpackDevConf), {
        contentBase: webpackDevConf.output.path,
        publicPath: webpackDevConf.output.publicPath,
        hot: true,
        stats: webpackDevConf.devServer.stats
    }));
}

// handle static files
app.use(serve(path.resolve(__dirname, viewDir), {
    maxage: 0
}));

app = http.createServer(app.callback());

app.listen(8080, '0.0.0.0', function() {
    console.log('app listen success.');
});
