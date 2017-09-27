module.exports = {
  webpack: (config, { dev }) => {
    config.devtool = 'eval'
    config.module.rules.push(
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'style-loader', 'css-loader']
      }
    )
    return config
  }
}
