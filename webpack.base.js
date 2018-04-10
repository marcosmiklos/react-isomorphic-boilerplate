/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
/**
 * define the most common webpack configs
 * shared between browser/server
 *
 */
const path = require('path');
const autoprefixer = require('autoprefixer');

function baseConfig(platform = 'browser', env) {
  const baseConfig = {
    context: path.resolve(__dirname),

    plugins: [],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'eslint-loader',
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          use: [{
            loader: 'url-loader',
            options: {
              name: env !== 'hot' ? '[name]-[hash].[ext]' : '[name].[ext]',
              outputPath: env !== 'hot' ? '../assets/' : './', // no tailing with '/' to avoid hot reload issue
              limit: 8192, // 8kB
            },
          }],
        },
        {
          test: /\.(gif|jpg|png|svg)$/,
          use: [{
            loader: 'url-loader',
            options: {
              name: env !== 'hot' ? '[name]-[hash].[ext]' : '[name].[ext]',
              outputPath: env !== 'hot' ? '../assets/' : './', // no tailing with '/' to avoid hot reload issue
              limit: 8192, // 8kB
            },
          }],
        },
        {
          // ico is lower than limit of url-loader, so we explictly use file-loader
          test: /.ico$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: env !== 'hot' ? '[name]-[hash].[ext]' : '[name].[ext]',
              outputPath: env !== 'hot' ? '../assets/' : './', // no tailing with '/' to avoid hot reload issue
            },
          }],
        },
      ],
    },
  };

  // server config with css-loader/locals
  // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/48#issuecomment-375288454
  if (platform === 'server') {
    baseConfig.module.rules.push(
      {
        test: /\.css$/,
        use: [
          'css-loader/locals',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'css-loader/locals',
        ],
      },
    );
  } else {
    baseConfig.module.rules.push(
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: env !== 'prod',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: env !== 'prod',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: env !== 'prod',
              plugins: [
                autoprefixer(),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: env !== 'prod',
            },
          },
        ],
      },
    );
  }

  return baseConfig;
}

export function findTargetRule(rules, targetTest) {
  let targetRule = {};
  rules.map((r) => {
    if (r.test.toString() === targetTest.toString()) {
      targetRule = r;
    }
    return false;
  });
  return targetRule;
}

export default baseConfig;
