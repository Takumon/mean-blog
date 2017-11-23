FROM node:8.9.1-alpine

# アプリをビルド
RUN mkdir -p /use/src/tmp
WORKDIR /usr/src/temp
COPY ./ /usr/src/temp/

RUN npm install
RUN npm run build

# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# # ビルドしたアプリ資産をコピー
# RUN mv /usr/src/temp/dist/server/* /usr/src/app
# RUN rm -rf /usr/src/temp

# # ライブラリをインストール
# COPY package.json /usr/src/app/
# COPY package-lock.json /usr/src/app
# RUN npm install --only=production

EXPOSE 3000
# ENV NODE_ENV production
# CMD [ "node", "./bin/www.js" ]
CMD [ "npm", "run", "run:server" ]


