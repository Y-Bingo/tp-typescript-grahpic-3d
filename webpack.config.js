const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	cache: {
		type: 'filesystem',
	},
	entry: './src/index.ts',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /.ts$/,
				use: ['ts-loader'],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [new HtmlWebpackPlugin({})],
	devServer: {
		compress: true,
		host: 'localhost',
		hot: true,
		port: 9933,
		historyApiFallback: true,
		open: true,
	},
};
