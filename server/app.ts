import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import * as jwt from 'jsonWebToken';


import { MONGO_URL, SECRET } from './config';
import { articleRouter } from './routes/article';
import { authenticateRouter } from './routes/authenticate';
import { setupRouter } from './routes/setup';

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
    mongoose.Promise = global.Promise;
  }

  private routes(): void {
    // 静的資産へのルーティング
    this.express.use(express.static(path.join(__dirname, 'public')));

    this.express.use('/setup', setupRouter);
    this.express.use('/api/authenticate', authenticateRouter);

    // TODO 認証部分はサービス化
    this.express.use(function(req, res, next) {

      const token = req.body.token || req.param('token') || req.headers['x-access-token'];

      if (!token) {
        return res.status(403).send({
          success: false,
          message: '認証失敗'
        });
      }

      jwt.verify(token, SECRET, function(err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: '認証失敗'
          });
        }

        req.decoded = decoded;
        next();
      });
    });


    this.express.use('/api/articles', articleRouter);

    // その他のリクエストはindexファイルにルーティング
    this.express.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });
  }
}

export default new App().express;
