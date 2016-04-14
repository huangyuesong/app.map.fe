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
                test: /\.(otf|eot|svg|ttf|woff|woff2)\??.*$/,
                loader: 'file-loader',
                query: {
                    name: 'font/[name].[hash].[ext]'
                },
            },
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
    ],
};
