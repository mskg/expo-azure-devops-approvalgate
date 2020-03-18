const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,

    // Generate sourcemaps for proper error messages
    devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'none',
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',

    optimization: {
        // We no not want to minimize our code.
        minimize: true,
    },

    performance: {
        // Turn off size warnings for entry points
        hints: false,
    },

    resolve: {
        extensions: [
            '.js',
            '.json',
            '.ts',
            '.tsx',
        ],
    },

    // Run babel on all .js files and skip those in node_modules
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
};