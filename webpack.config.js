var webpack = require('webpack');

module.exports = {
    entry: './index.js',

    output: {
        path: 'public',
        filename: 'bundle.js',
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react',
            },

            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                ],
            },

            {
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },

            {
                test: /(\.ttf) | (\.svg)/,
                loaders: [
                    'file-loader',
                ],
            },

            {
                test: /\.woff/,
                loaders: [
                    'url?limit=10000&minetype=application/font-woff',
                ],
            },
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
    ],
};
