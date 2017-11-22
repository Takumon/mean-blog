FROM node:8.1.4-alpine

# アプリをビルド
RUN mkdir -p /use/src/tmp
WORKDIR /usr/src/temp
COPY ./server /usr/src/temp/server
COPY ./src /usr/src/temp/src
COPY ./server /usr/src/temp/server
COPY ./.angular-cli.json /usr/src/temp/.angular-cli.json
COPY ./tsconfig.json /usr/src/temp/tsconfig.json
COPY ./package.json /usr/src/temp/package.json
COPY ./package-lock.json /usr/src/temp/package-lock.json

RUN npm install
RUN npm run build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ビルドしたアプリ資産をコピー
RUN mv /usr/src/temp/dist/server /usr/src/app
RUN rm -rf /usr/src/temp

# ライブラリをインストール
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app
RUN npm install --only=production

EXPOSE 3000
CMD [ "node", "./bin/www.js" ]
