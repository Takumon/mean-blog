FROM node:8.1.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ライブラリをインストール
COPY package.json /usr/src/app/
RUN npm install --only=production

# アプリ資産をコピー
COPY ./dist/server /usr/src/app

EXPOSE 3000
CMD [ "node", "./bin/www.js" ]
