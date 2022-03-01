# Setup Node.js

## 1. 作業ディレクトリの作成、各種ファイルの準備

任意の名前のディレクトリを作成し、そのディレクトリ直下に下記のとおりファイルを配置する。
```
.
├── app
│   ├── ...
│   └── Dockerfile
├── .gitignore
└── docker-compose.yml
```

## 2. Dockerコンテナの起動

作業ディレクトリに移動し、下記コマンドを実行し、コンテナを起動する。
```
docker-compose up -d
```

下記コマンドを実行し、appコンテナに入り、nodeパッケージをインストールする。
```
docker-compose exec app ash
```
```
yarn install
```

下記コマンドを実行し、ローカルサーバーを起動する。
```
yarn dev
```
Webブラウザを起動して、http://localhost:3000 にアクセスし、サーバーが起動していることを確認する。

## 3. その他

## Webpackのビルド

下記コマンドを実行し、Webpackのビルドを実行する。
```
yarn build
```
distディレクトリにバンドルされたファイル群が生成されたことを確認する。

## 参考資料
https://madogiwa0124.hatenablog.com/entry/2020/05/03/152217<br>
