import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts']
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              module: 'ESNext',
              target: 'ES2020'
            }
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',  
          'css-loader'     
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name][ext]'
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'src/templates', 
          to: 'templates',
          noErrorOnMissing: true 
        },
        { 
          from: 'static', 
          to: 'static',
          noErrorOnMissing: true 
        }
      ]
    })
  ],
  devServer: {
    static: [
      { 
        directory: path.join(__dirname, 'static'),
        publicPath: '/static',
        watch: true
      },
    {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/'
    }
  ],
    port: 3001,
    open: true,
    hot: true,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true
    },
    compress: true
  }
};