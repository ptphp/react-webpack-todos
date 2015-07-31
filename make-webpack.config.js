/*
* @Author: dmyang
* @Date:   2015-05-18 14:16:41
* @Last Modified by:   dmyang
* @Last Modified time: 2015-07-31 13:39:41
*/

'use strict';

// @see http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html
// @see https://github.com/webpack/react-starter/blob/master/make-webpack-config.js

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var pageSrc = path.resolve(process.cwd(), 'src');

var excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/,
    /node_modules[\\\/]items-store[\\\/]/
];

function makeConf(options) {
    options = options || {};

    var debug = options.debug !== undefined ? options.debug : true;
    var config = {
        // entry: {
        //     a: ['./src/js/a.js']
        // },

        entry: genEntries(),

        output: {
            // 在dev模式下，__build目录是虚拟的，webpack的dev server存储在内存里
            path: path.resolve(debug ? '__build' : 'assets/'),
            filename: debug ? '[name].js' : 'js/[hash:8].[name].min.js',
            chunkFilename: debug ? '[name].js' : 'js/[chunkhash:8].chunk.js',
            // sourceMapFilename: '[hash].map',
            hotUpdateChunkFilename: debug ?'[name].js' : 'js/[id].[hash:8].hot-update.js',
            publicPath: ''
        },

        // externals: {
        //     'react': 'React'
        // },

        resolve: {
            // 可以直接使用npm安装依赖，前后端共享module！
            root: ['./src', './node_modules/'],
            alias: {
                'zepto': path.resolve(__dirname, 'src/js/lib/zepto.js'),
            },
            extensions: ['', '.js', '.jsx', '.css', '.html', '.png', '.jpg']
        },

        resolveLoader: {
            root: path.join(__dirname, 'node_modules')
        },

        plugins: [],

        module: {
            noParse: ['react'],
            loaders: [
                {test: /\.css$/, loader: 'style!css'},
                {test: /\.scss$/, loader: 'style!css!sass'},
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loaders: [
                        'image?{bypassOnDebug: true, progressive:true, \
                            optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
                        // url-loader更好用，小于14KB的图片会自动转成dataUrl，
                        // 否则则调用file-loader，参数直接传入
                        // 'url?limit=14000&name=img/[hash:8].[name].[ext]',
                        'url?limit=14000&name=img/[hash:8].[name].[ext]',
                    ]
                },
                {
                    test: /\.(woff|eot|ttf)$/i,
                    loader: 'url?limit=14000&name=fonts/[hash:8].[name].[ext]'
                },
                {test: /\.(tpl|ejs)$/, loader: 'ejs'},
                {test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
                {test: /\.jsx$/, exclude: /node_modules/, loader: 'babel'}
            ]
        },

        devServer: {
            stats: {
                cached: false,
                exclude: excludeFromStats,
                colors: true
            }
        }
    };

    if(debug) {
        // css文件独立加载
        // config.plugins.push(new ExtractTextPlugin('channel.css?[chunkhash]'));
    } else {
        // 自动生成入口文件，入口js名必须和入口文件名相同
        // 例如，频道页的入口文件是channel.html，那么在js目录下必须有一个channel.js作为入口文件
        var pages = fs.readdirSync(pageSrc);

        pages.forEach(function(filename) {
            var m = filename.match(/(.+)\.html$/);

            if(m) {
                // @see https://github.com/kangax/html-minifier
                var conf = {
                    template: path.resolve(pageSrc, filename),
                    filename: filename
                };

                if(m[1] in config.entry) {
                    conf.inject = 'head';
                    conf.chunks = [m[1]];
                }

                config.plugins.push(new HtmlWebpackPlugin(conf));
            }
        });

        config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    return config;
}

function genEntries() {
    var jsDir = path.resolve(pageSrc, 'js');
    var names = fs.readdirSync(jsDir);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(jsDir, name) : '';

        if(entry) map[entry] = entryPath;
    });

    return map;
}

module.exports = makeConf;
