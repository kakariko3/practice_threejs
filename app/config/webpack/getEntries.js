const glob = require('glob');
const path = require('path');

/**
 * 指定したentryのルートディレクトリ配下のjsまたはtsファイルのファイル名とパスのobjectを取得
 * 例) /entries/foo.ts => { foo: "/entries/foo.ts" }
 * ※ルートディレクトリ配下にディレクトリを切り、そこにjs,tsファイルをおいた場合は無視される。
 * @param {string} entryRoot entryのルートディレクトリ
 */
module.exports = function getEntries(entryRoot) {
  const obj = {};
  const filePaths = glob.sync(`${entryRoot}/*.{js,ts}`);
  filePaths.forEach((filePath) => {
    obj[path.basename(filePath, path.extname(filePath))] = filePath;
  });
  return obj;
};
