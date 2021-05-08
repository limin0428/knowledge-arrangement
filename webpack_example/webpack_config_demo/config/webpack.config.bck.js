'use strict';
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
// js文件压缩
const TerserPlugin = require('terser-webpack-plugin');
// 将css单独打包成一个文件的插件，它为每个包含css的js文件都创建一个css文件。它支持css和sourceMaps的按需加载。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// css文件压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
const appPackageJson = require(paths.appPackageJson);
// 根据环境变量判断是否需要sourceMap
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// webpack本地客户端入口  热更新
const webpackDevClientEntry = require.resolve(
  'react-dev-utils/webpackHotDevClient'
);
console.log('----', webpackDevClientEntry)
// 
const reactRefreshOverlayEntry = require.resolve(
  'react-dev-utils/refreshOverlayInterop'
);
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);
const useTypeScript = fs.existsSync(paths.appTsConfig);
const swSrc = paths.swSrc;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }
  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();
// webpack配置正文  webpackEnv：传入的环境变量
module.exports = function (webpackEnv) {
  // 是否为开发环境
  const isEnvDevelopment = webpackEnv === 'development';
  // 是否为生产环境
  const isEnvProduction = webpackEnv === 'production';
  // 是否为详细的生产环境
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes('--profile');
  /**
   * getClientEnvironment: 
   * @param publicUrl
   * return 环境
   */
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  // 是否使用热更新(???)
  const shouldUseReactRefresh = env.raw.FAST_REFRESH;
  /**
   * 
   * @param {*} cssOptions  css-loader的配置项
   * @param {*} preProcessor  
   * @returns css的loader集合
   */
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      // 开发环境使用style-loader
      isEnvDevelopment && require.resolve('style-loader'),
      // 生产环境使用MiniCssExtractPlugin插件loader
      // plugins中配合使用
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: paths.publicUrlOrPath.startsWith('.')
          ? { publicPath: '../../' }
          : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            postcssNormalize(),
          ],
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    // 预处理器存在(less/sass/stylus)
    // 加载resolve-url-loader和
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };
  return {
    // 判断模式
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    // 在第一个错误出现时抛出失败结果，而不是容忍它。这将迫使webpack退出打包过程
    bail: isEnvProduction,
    // 此选项控制是否生成，以及如何生成source map
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    // 入口文件 开发环境并且不使用react重新刷新
    entry:
      isEnvDevelopment && !shouldUseReactRefresh
        ? [
            // 
            webpackDevClientEntry,
            // paths 
            paths.appIndexJs,
          ]
        : paths.appIndexJs,
    output: {
      // 生产环境
      path: isEnvProduction ? paths.appBuild : undefined,
      // 告知webpack在bundle中引入「所包含模块信息」的相关注释。
      pathinfo: isEnvDevelopment,
      // 输出文件名称
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
      // 告诉 webpack 使用未来版本的资源文件 emit 逻辑，允许在 emit 后释放资源文件的内存。
      // 这可能会破坏那些认为资源文件 emit 后仍然可读的插件。
      // webpack5.0.0 移除并默认支持
      futureEmitAssets: true,
      // chunk文件名称
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      // 公共资源路径
      publicPath: paths.publicUrlOrPath,
      // 
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : isEnvDevelopment &&
          (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      //
      jsonpFunction: `webpackJsonp${appPackageJson.name}`,
      // 当输出为library时，此选项将决定使用哪个全局对象来挂载library。为了使UMD构建在浏览器和Node.js上均可用，应将output.globalObject选项设置为 'this'
      globalObject: 'this',
    },
    // 优化
    optimization: {
      // 开启优化
      minimize: isEnvProduction,
      // 优化
      minimizer: [
        // 压缩js代码
        new TerserPlugin({
            // 压缩配置
          terserOptions: {
            // parse options
            parse: {
              ecma: 8,
            },
            // 压缩options
            compress: {
                // 语法
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            // mangle options
            mangle: {
              safari10: true,
            },
            // 压缩时，是否保留源类名
            keep_classnames: isEnvProductionProfile,
            // 压缩时，是否保留函数名
            keep_fnames: isEnvProductionProfile,
            // 格式选项  format 可以使用output向后兼容
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          // 源代码映射
          sourceMap: shouldUseSourceMap,
        }),
        // 优化或者压缩css
        new OptimizeCSSAssetsPlugin({
            // cssProcessor 压缩css的处理器
            // 传递给cssProcessor的配置对象
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  inline: false,
                  annotation: true,
                }
              : false,
          },
          // 传递给cssProcessor的插件配置对象
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      // 分块策略 
      splitChunks: {
        chunks: 'all',
        // boolean false: 将保持chunk的名称相同
        name: isEnvDevelopment,
      },
      // 运行时chunk false 会将运行时的chunk内嵌到入口chunk中
      // object string boolean 会为入口每个chunk提供额外的运行时chunk(只含有runtime)
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
      alias: {
        'react-native': 'react-native-web',
        ...(isEnvProductionProfile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        ...(modules.webpackAliases || {}),
      },
      plugins: [
        PnpWebpackPlugin,
        new ModuleScopePlugin(paths.appSrc, [
          paths.appPackageJson,
          reactRefreshOverlayEntry,
        ]),
      ],
    },
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            {
              test: [/\.avif$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                mimetype: 'image/avif',
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),
                presets: [
                  [
                    require.resolve('babel-preset-react-app'),
                    {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
                ],
                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                      },
                    },
                  ],
                  isEnvDevelopment &&
                    shouldUseReactRefresh &&
                    require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                cacheDirectory: true,
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [
                    require.resolve('babel-preset-react-app/dependencies'),
                    { helpers: true },
                  ],
                ],
                cacheDirectory: true,
                cacheCompression: false,
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap,
              },
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
              }),
              sideEffects: true,
            },
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                },
                'sass-loader'
              ),
              sideEffects: true,
            },
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                'sass-loader'
              ),
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      isEnvProduction &&
        shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      new ModuleNotFoundPlugin(paths.appPath),
      new webpack.DefinePlugin(env.stringified),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      isEnvDevelopment &&
        shouldUseReactRefresh &&
        new ReactRefreshWebpackPlugin({
          overlay: {
            entry: webpackDevClientEntry,
            module: reactRefreshOverlayEntry,
            sockIntegration: false,
          },
        }),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvDevelopment &&
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            fileName => !fileName.endsWith('.map')
          );
          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      isEnvProduction &&
        fs.existsSync(swSrc) &&
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc,
          dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        }),
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          typescript: resolve.sync('typescript', {
            basedir: paths.appNodeModules,
          }),
          async: isEnvDevelopment,
          checkSyntacticErrors: true,
          resolveModuleNameModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          resolveTypeReferenceDirectiveModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          tsconfig: paths.appTsConfig,
          reportFiles: [
            '..*.{ts,tsx}',
            '**/srcsrcsrcsrc/setupProxy.*',
            '!**/src/setupTests.*',
          ],
          silent: true,
          formatter: isEnvProduction ? typescriptFormatter : undefined,
        }),
      !disableESLintPlugin &&
        new ESLintPlugin({
          extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
          formatter: require.resolve('react-dev-utils/eslintFormatter'),
          eslintPath: require.resolve('eslint'),
          failOnError: !(isEnvDevelopment && emitErrorsAsWarnings),
          context: paths.appSrc,
          cache: true,
          cacheLocation: path.resolve(
            paths.appNodeModules,
            '.cache/.eslintcache'
          ),
          cwd: paths.appPath,
          resolvePluginsRelativeTo: __dirname,
          baseConfig: {
            extends: [require.resolve('eslint-config-react-app/base')],
            rules: {
              ...(!hasJsxRuntime && {
                'react/react-in-jsx-scope': 'error',
              }),
            },
          },
        }),
    ].filter(Boolean),
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    performance: false,
  };
};
