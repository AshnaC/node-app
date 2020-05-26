const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	devtool: "source-map",
	devServer: {
		contentBase: path.join(__dirname, "public"),
		port: 8080,
		host: `localhost`
	},
	entry: {
		app: ["./src_client/index.js"]
	},
	output: {
		path: path.join(
			__dirname,
			"target",
			"webinstall",
			"source",
			"public",
			"app"
		),
		publicPath: "/app/",
		filename: `[name].js`
	},
	module: {
		rules: [
			{ test: /\.(js|jsx)$/, use: "babel-loader" },
			{
				test: /\.less$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: true
						}
					},
					"less-loader"
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg|png)$/,
				loader: "file-loader",
				options: {
					name: "[name].[ext]",
					outputPath: "img/"
				}
			}
		]
	},
	resolve: {
		alias: {}
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "public/index.html",
			filename: "../index.html"
		})
	]
};
