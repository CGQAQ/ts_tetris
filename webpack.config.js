var path = require('path');

const dev = 'development';
const pro = 'production';




module.exports = {
    mode: pro,
    entry: path.resolve(__dirname, 'index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    module:{
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '*'],
    },

    optimization: {
        minimize: true,
    }
    
}