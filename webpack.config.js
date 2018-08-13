var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'eval-source-map',
	entry:[
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		'react-hot-loader/patch',//热更新，局部修改页面
		path.join(__dirname,'app/index.js')
		], //没有./会认为是一个模块，去node-modules去找
	output:{
		path:path.join(__dirname,'/dist/'),
		publicPath: '/',
    	filename: '[name].js'
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template:'./index.tpl.html',//自动链接打包文件
			inject:'body',
			filename:'./index.html'
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV':JSON.stringify('development')
		})
	],
	module: {
		resolve:{
			extensions:['','.js','.json']
		},
	    loaders: [
	      {
	        test: /\.js$/,//需要匹配那些文件
	        loader: 'babel-loader',
	        exclude: /node_modules/,//哪些文件不需要webpack处理
	         //可以使用query来指定参数
	        query:{
	        	presets:['react','es2015']
	        }
	      },
	      {
	        test: /\.css$/,
	        loader: 'style!css'
	      },
	      {
	      	test: /\.less$/,
	      	loader:'style-loader!css-loader!less-loader'
	      }
	    ]
	  }
}