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
	plugins: [
		new HtmlWebpackPlugin({
			title: 'TypeScript 图形渲染实战 - 3D 架构设计与实现',
			filename: 'index.html',
			template: './index.html',
			inject: 'body',
		}),
	],
	devServer: {
		compress: true,
		host: 'localhost',
		hot: true,
		port: 9933,
		historyApiFallback: true,
		open: true,
	},
};
