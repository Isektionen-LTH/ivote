module.exports = {
	// entry: './app/main.js',
	entry: ['whatwg-fetch', './app/main.js'],
	output: {
		path: './bin',
		filename: 'app.bundle.js',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['env', 'react']
			}
		}]
	},
	cache: true,
	debug: true,
	devtool: 'source-map'
};
