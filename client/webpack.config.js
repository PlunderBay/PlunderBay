module.exports = {
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            "shared": [ "../shared/*" ]
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