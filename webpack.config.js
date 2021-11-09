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
		static: {
			directory: path.join(__dirname, './'),
		},
		compress: true, //如果为 true ，开启虚拟服务器时，为你的代码进行压缩。加快开发流程和优化的作用
		host: 'localhost', // 设置主机名，默认为"localhost"
		port: 9933, // 设置端口号,默认端口号为8080
		historyApiFallback: true, //让所有404错误的页面定位到index.html
		hot: true,
		open: true, //启动服务器时，自动打开浏览器，默认为false
	},
};
