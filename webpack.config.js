// lib imports
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {  
    mode: 'production',
    entry: './index.js',
    target: 'node',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
        },
        ],
    },
    plugins: [
        new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            extractComments: /@extract/i,
          }),
        ],
    }
};