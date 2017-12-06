[![CircleCI](https://circleci.com/gh/Takumon/mean-blog/tree/master.svg?style=svg)](https://circleci.com/gh/Takumon/mean-blog/tree/master)　


## License
MIT

## チームでナレッジ共有&蓄積するためのブログアプリ
* イントラでの利用を想定
  * Dockerで簡単インストール
* Markdown入力補助機能付き！プレーンテキスト形式でも書ける!
  * Markdownへの壁を低くしてMarkdownで書く文化を浸透させられる
  * Markdownを知らなくてもリストやテーブルなどが簡単に入力できる
* 記事に対してコメントがしやすい!いいね機能も付いている!

## インストール方法
* docker-compose.yml作成

```
version: "3.3"
services:
  web:
    image: takumon/mean-blog_auto
    ports:
      - 3000:3000
    depends_on:
      - mongo
    links:
      - mongo
    environment:
      MONGO_URL: mongodb://mongo:27017/test
  mongo:
    image: mongo:3.5.12
    ports:
      - 27017:27017
    volumes:
      - ./db:/data/db
  db-viewer:
    image: mongo-express:latest
    ports:
     - 8082:8081
    depends_on:
      - mongo
    links:
     - mongo
```

* コンテナを起動

```
$ docker-compose up -d
```

* ブラウザで`http://localhost:3000`にアクセス

## 構成
* クライアント(フレームワーク) ・・・ Angular v5
* クライアント(UIライブラリ) ・・・ Angular Material v2
* サーバ ・・・ Express v4
* 実行環境 ・・・Node v8
* DB ・・・ MongoDB v3
