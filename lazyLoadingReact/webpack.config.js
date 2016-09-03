var webpack = require('webpack');
var path = require('path');
require('intersection-observer');
//定义一些地址常量,下面都是约定俗称的写法

const CURRENT_PATH = path.resolve(__dirname);//当前目录
const ROOT_PATH = path.join(__dirname, '../');//上一级目录
//指定任意目录
const BUILD_PATH = path.join(__dirname, 'build');
const MODULES_PATH = path.join(ROOT_PATH, './node_modules');

var config = {
	//上下文(相当设置当前目录)
	context: CURRENT_PATH,
	//配置入口
	entry: {
		index: './index.js',
	},
	//配置输出
	output: {
		path: BUILD_PATH,
		filename: 'bundle.js',//name会油entry中的键名替代
		publicPath: '/build/'
	},
	//解析模块路径的相关配置
	resolve: {
		root: MODULES_PATH,
		extensions: ['', '.js', '.json', '.scss'],//require模块可以省略不写这些后缀
		alias: {

		}//定义模块的别名,方便直接引用
	},
	//模块
	module: {
		loaders: [
    	{test: /\.jsx?$/, loader: 'babel-loader', query: {presets: ['es2015', 'react']}},
    	{test: /\.css$/, loader: 'style!css'},
    	{test: /\.scss$/, loader: 'style!css!sass'},
    	{test: /\.(jpe?g|png|gif|svg)\??.*$/, loader: 'url-loader?limit=8192&name=[name].[ext]'},
  	]//使用相关loader来加载,同时也可在文件中直接require(import)这些文件
	},

	devServer:{
		historyApiFallback: true,
		hot: true,
		inline: true,
		progress: true,
	},
	//插件
	plugins: {

	}
}

module.exports = config;