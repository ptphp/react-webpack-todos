/*
* @Author: dmyang
* @Date:   2015-06-16 15:19:59
* @Last Modified by:   dmyang
* @Last Modified time: 2015-07-31 11:54:21
*/

'use strict';

var gulp = require('gulp');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');

var webpackConf = require('./webpack.config');
var webpackDevConf = require('./webpack-dev.config');

var src = './src';
var assets = './assets';

gulp.task('clean', function() {
    return gulp.src(assets, {read: true}).pipe(clean());
});

gulp.task('pack', ['clean'], function(done) {
    webpack(webpackConf, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
});

gulp.task('default', ['pack'], function() {
    return gulp
        .src(assets + '/*.html')
        .pipe(replace(/<script(.+)?data-debug([^>]+)?><\/script>/g, ''))
        // @see https://github.com/kangax/html-minifier
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(assets));
});

// @see http://webpack.github.io/docs/webpack-dev-server.html
gulp.task('dev', function(done) {
    var compiler = webpack(webpackDevConf);
    var devSvr = new WebpackDevServer(compiler, {
        contentBase: webpackConf.output.path,
        publicPath: webpackDevConf.output.publicPath,
        hot: true,
        stats: webpackDevConf.devServer.stats,
    });

    devSvr.listen(8080, 'localhost', function(err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err);

        gutil.log('[webpack-dev-server]',
            'http://localhost:8080/webpack-dev-server/index.html');

        // keep the devSvr alive
        // done();
    });
});
