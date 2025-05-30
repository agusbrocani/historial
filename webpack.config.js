const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  // 1) Entry point
  entry: path.resolve(__dirname, 'src', 'index.tsx'),

  // 2) Output bundle
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',     // para que historyApiFallback funcione
    clean: true,         // limpia dist/ antes de cada build
  },

  // 3) Source maps
  devtool: 'source-map',

  // 4) Resolver extensiones
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  module: {
    rules: [
      // 5) TS / TSX
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      // 6) SCSS Modules (*.module.scss)
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            },
          },
          'sass-loader',
        ],
      },

      // 7) SCSS global (sin *.module.scss)
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },

      // 8) CSS plano
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },

      // 9) Imágenes / fuentes
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    // 10) Toma tu public/index.html como plantilla
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: 'body',
    }),
  ],

  devServer: {
    // 11) Sirve estáticos desde public/
    static: {
      directory: path.resolve(__dirname, 'public'),
      publicPath: '/',
    },
    historyApiFallback: true,  // SPA routing sin 404
    port: 3000,
    hot: true,
    open: true,
    client: {
      overlay: true,           // muestra errores en pantalla
    },
  },
};
