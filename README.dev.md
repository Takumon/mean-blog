# 開発者向けREADME
クライアント資産の格納場所やサーバのルーターはどこに格納すべきかなどを忘れないようにするため本ドキュメントを示します。
## 全体フォルダ構成

```
ルートフォルダ
├── src                       ・・・(1)　クライアント資産
│   ├── app.component.spec.ts ・・・(1-1)　クライアント側テスト資産
│   ├── app.component.ts
│   ・・・
├── server                     ・・・(2) サーバ資産
├── server_test                ・・・(2-1) サーバのテスト資産
├── dist                       ・・・(3) コンパイル資産出力先(サーバ、クライアントの両方)
│   ├── server                 ・・・(3-1) コンパイルされたサーバ資産
│   │   └── public             ・・・(3-2) コンパイルされたクライアント資産
│   └── server_test            ・・・(3-3) コンパイルされたサーバのテスト資産
└── e2e                        ・・・(4) E2Eテスト資産
```

* 本アプリは、サーバ側とクライアント側を１つのリポジトリで管理しています。コンパイル後はExpressを使ったNodeアプリとして`dist/server`フォルダ配下に資産が格納されます。クライアント側の資産は`dist/server/public`配下に格納され、アプリ起動時に静的資産として公開されます。
* テスト資産はサーバ側とクライアント側で格納の配置のルールが異なります。
  * クライアント側はメイン資産と同じフォルダに配置します。テスト資産のファイル名はメイン資産の拡張子`ts`を`spec.ts`に変えたものです。
  * サーバ側は`server_test`フォルダにメイン資産と同階層に配置します。テスト資産のファイル名はメイン資産の拡張子`ts`を`spec.ts`に変えたものです。
* クライアント側のコンパイルは`ng`コマンド、サーバ側のコンパイルは`tsc`コマンドを使用します。


## 各資産の構成

### クライアント資産
テスト資産もメインの資産と同じ場所に格納します。
機能をいくつかに分割してそれぞれでモジュールをわけています。

```
src/app
├── app-routing.module.ts  ・・・(1)
├── app.component.html
├── app.component.scss
├── app.component.spec.ts
├── app.component.ts
├── app.module.ts
├── articles             ・・・(2)
│   └・・・
├── drafts               ・・・(3)
│   └・・・
├── users                ・・・(4)
│   └・・・
├── login                ・・・(5)
│   └・・・
├── errors               ・・・(6)
│   └・・・
├── shared               ・・・(7)
│   └・・・
└── state                ・・・(8)
```
1. アプリのルートコンポーネントです。
2. 記事に関するコンポーネントです。
3. 記事の下書きに関するコンポーネントです。
4. ユーザのコンポーネントです。
5. ログインのコンポーネントです。
6.  共通エラーのコンポーネントです。
7.  アプリ全体で使うユーティリティです。
8.  アプリ全体で使う状態管理の資産です。


#### モジュールごとの構成
1つの機能を実現するモジュールは下記のような構成になります。

```
src/app/articles/
├── drafts-routing.module.ts   ・・・(1)
├── drafts.module.ts           ・・・(2)
├── draft-detail               ・・・(3)
│   └・・・
├── draft-list
│   └・・・
├── draft-edit
│   └・・・
├── shared                     ・・・(4)
│   └・・・
└── state                      ・・・(5)
    └・・・
```

1. 機能単位のルーターです。ルーターは機能ごとに管理します。
2. 機能で使用するすべての部品を定義しているモジュールです。このモジュールは、さらにアプリのルートモジュールで読み込まれます。
3. コンポーネントごとのフォルダです。配下にコンポーネント、SASSファイル、HTMLファイルを格納します。
4. 機能で使う状態管理の資産です。
5. 機能で共通で使うユーティリティです。



### サーバ資産

```
server
├── app.ts                       ・・・(1)
├── bin
│   └── www.ts                   ・・・(2)
├── config                       ・・・(3)
│   └・・・
├── connection.ts
├── environment-config.ts
├── helpers
│   └・・・
├── logger.ts
├── middleware
│   └・・・
├── models                       ・・・(4)
│   └・・・
├── routes                       ・・・(5)
│   └・・・
└── tsconfig.server.json
```

1. Expressで使用するルータと依存モジュールを定義します。クライアント資産はビルドするとpublicフォルダ配下に出力されるようにしているので、静的資産へのルーティングはpublicフォルダを指定しています。
2. Node.js でサーバを起動するための設定をしています。
3. 設定ファイルを格納します。node-configを使って環境別に設定ファイルを切り替えられるようにしています。
4. MongoDBにアクセスするためのモデルを定義します。DBアクセスにはmangoosを使います。
5. エンドポイントごとの処理を記述するルータを定義します。

### サーバテスト資産
```
server_test
├── app.spec.ts                         ・・・(1)
├── test.server.conf.ts                 ・・・(2)
├── test.server.ts                      ・・・(3)
└── tsconfig.server_test.json           ・・・(4)
```
1. 単体テストというより結合テストで、１つ１つの資産に対してではなくapp.tsに対して、実際にDBに接続しながらAPIテストを行います。supertestというライブラリを使っています。
2. 起動時の設定です。
3. 起動処理です。レポーターにはjasmine-spec-reporterを使っています。
4. テスト資産をコンパイルする時の設定ファイルです。


### E2Eテスト資産
```
e2e
├── app.e2e-spec.ts                     ・・・(1)
├── app.po.ts
└── tsconfig.e2e.json
```
1. テストを記述しています。


## Package.jsonのスクリプト
スクリプトの概要を示します。

### ビルド系
* start
  * クライアント資産とサーバ資産の両方を起動します。
* start:client
  * クライアント資産をコンパイルして起動します。Angular CLIのngコマンドにお任せしています。なおstartではクライアント資産とサーバ資産で二つのサーバを起動するので、クライアントからサーバへ（リクエストを送れるようにプロキシ設定を行っています。プロキシ設定ファイルについては下で触れます。
* start:server
  * サーバ資産をコンパイルしてExpressを起動します。
* watch:server
  * サーバ側のTypeScriptをウォッチして変更があればコンパイルするようにします。
* boot:server
  * コンパイルしたサーバ側資産を起動します。nodeではなくnodemonを使うことでコンパイルしたサーバ資産に更新があった場合でも即座に更新を反映するようにしています。
* build
  * クライアント資産とサーバ資産の両方をコンパイルします。
* build:server
  * サーバ資産をコンパイルしています。コンパイル時の設定は下で触れる/server/tsconfig.server.jsonを使います。
* build:client
  * クライアント資産をコンパイルしています。出力先はサーバ側資産の静的ファイル格納フォルダ（dist/server/public）を指定しています。
* buildRun
  * クライアント資産とサーバ資産の両方をコンパイルしサーバ資産を起動します。とりあえずデプロイするアプリを起動したい時の便利コマンドです。

### テスト系
* test
  * クライアント側とサーバ側のテストを実行します。
* test:client
  * クライアント側のテストを実行します。Angular CLIのngコマンドにお任せしています。
* watch:server_test
  * サーバ側テスト資産をウォッチして変更があればコンパイルするようにします。
* boot:server_test
  * コンパイルしたサーバ側テスト資産を起動します。nodeではなくnodemonを使うことで資産に更新があった場合でも即座に反映するようにしています。
* build:server_test
  * サーバ側テスト資産をコンパイルします。コンパイル時の設定は下で触れるserver_test/test.server.conf.tsを使います。

### E2Eテスト系
* e2e
  * E2Eテストを実行します。Angular CILプロジェクトデフォルトのe2eコマンド(= ng e2eコマンド)は使いません。ng　e2eはクライアント資産だけコンパイルして起動する処理が入っているからです。今回はビルドしたアプリ(クライアントとサーバが１つにまとまったアプリ)に対してテストします。
* webdriver:update
  * E2Eテストに必要なWebDriverをインストールまたは更新します。
* webdriver:start
  * WebDriverを起動します。Protractorのテストは事前にWebDriverを起動しておく必要があります。
* protractor
  * E2Eテストを実行します。起動時の設定は下で触れるprotractor.conf.jsを使います。

### その他
* lint
  * クライアント側資産の静的コード解析を実行します。
* heroku-prebuild
  * Herokuアップ時にビルド前に実行するスクリプトです。本アプリでは得にビルド前に実行する処理はありませんが、本スクリプトがないとHerokuアップが失敗するので定義しています。
* heroku-postbuild
  * Herokuアップ時にビルド後に実行するスクリプトです。ここでは、`npm run build`を実行しNode.jsアプリを起動するようにしています。
* analyze
  * クライアント資産ビルド時に、ビルド資産のサイズをグラフィカルに示します。アプリの機能とは直接関係ありあせんが、アプリのサイズを小さくする時の分析のためのスクリプトです。


## Herokuへのデプロイ
本アプリはデモ環境をHerokuに用意しています。
* デプロイ先
  * https://material-blog-demo.herokuapp.com/
* 管理用ダッシュボード
  * https://dashboard.heroku.com/apps/material-blog-demo

### デプロイ手順
ローカルにHerokuCLIをインストール済みという前提です。

* Herokuにログインします。
```
$ heroku login
```

* Herokuにアップします。
  * herokuアップ用にherokuというリポジトリをローカルに作成しているので、そこに対してマスター資産をプッシュします。
  * プッシュすると後は自動でデプロイしてくれます。
```
$ git push heroku master
```

## Heroku関連資産
* Procfile
  * Herokuアップ時に実行する処理を記述したファイルです。


## Dockerイメージ
本アプリは、GitHubとDockerHubを連携しているため
GitHubにプッシュする毎にDockerHubにてイメージが更新されます。
Dockerイメージ作成時にテスト実行用に`docker-compose.test.yml`を用意しています。

* DockerHub
  * https://hub.docker.com/r/takumon/mean-blog_auto/

## Docker関連資産
* Dockerfile
  * Dockerイメージ作成用スクリプトです。
* docker-compose.yml
  * 本リポジトリをクローンして、ローカルでイメージを作成してアプリを起動する場合の設定ファイルです。
* docker-compose.dev.yml
  * 本リポジトリをクローンして、ローカルでアプリを起動する際に必要なDB環境を起動するための設定ファイルです。DB資産は`db`フォルダ配下に生成されるようにしています。
* docker-compose.sample.yml
  * DockerHubにあるイメージを使用して本アプリを起動する時の設定ファイルの例です。特に本リポジトリをクローンしなくても、ローカルにこのファイルを作成し`docker-compose up -d`を実行すればアプリを起動できます。
* docker-compose.test.yml
  * Dockerイメージ作成時にテストを必ず実行するため本ファイルを定義しています。実質ビルドしかしていない仮のファイルです。


## CI
本リポジトリはGitHub上にプッシュされる毎にCircleCIにてビルドを実施しています。
また、Codeclimateというツールで静的コード解析を実施しています。
* CircleCI
  * https://circleci.com/gh/Takumon/mean-blog/tree/master
* Codeclimate
  * https://codeclimate.com/github/Takumon/mean-blog

## CI関連資産
* .circleci/config.yml
  * ビルド、クライアント側テスト、クライアント側テストカバレッジ測定　を実施するような定義にしています。
* .codeclimate.yml
  * CodeClimateが規定するTypeSciptのデフォルトの静的コード解析を実施するような定義にしています。
