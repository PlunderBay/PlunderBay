const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            shared:  path.resolve(__dirname, '../shared'),
        }
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
}