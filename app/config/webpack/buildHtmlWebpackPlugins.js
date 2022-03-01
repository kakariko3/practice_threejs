const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 指定したentriesと同名のhtmlテンプレートを読み込みHtmlWebpackPluginを生成する
 * ※ルートディレクトリ配下にディレクトリを切り、そこにhtmlファイルをおいた場合は無視される。
 * @param {object} entries { foo: "/entries/foo.ts" }のようなentryを表すオブジェクト
 * @param {string} templateRootPath entryのjsを読み込むtemplateファイル(html)のRootパス
 */
module.exports = function buildHtmlWebpackPlugins(entries, templateRootPath) {
  return Object.keys(entries).map(
    (entryName) =>
      new HtmlWebpackPlugin({
        filename: `${entryName}.html`,
        template: `${templateRootPath}/${entryName}.html`,
        chunks: [entryName],
      })
  );
};
