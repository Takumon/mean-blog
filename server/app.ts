import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import { messageRouter } from './routes/message';
import { MONGO_URL } from './config';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    // 接続する MongoDB の設定
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_URL || MONGO_URL, {
      useMongoClient: true,
    });
    process.on('SIGINT', function() { mongoose.disconnect(); });
  }

  private routes(): void {
    // 静的資産へのルーティング
    this.express.use(express.static(path.join(__dirname, 'public')));

    this.express.use('/api/messages', messageRouter);

    // その他のリクエストはindexファイルにルーティング
    this.express.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });
  }
}

export default new App().express;
