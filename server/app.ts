import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import * as jwt from 'jsonWebToken';


import { MONGO_URL, SECRET } from './config';
import { authenticateRouter } from './routes/authenticate';
import { authenticate } from './middleware/authenticate';
import { articleRouter } from './routes/article';
import { commentRouter } from './routes/comment';
import { userRouter } from './routes/user';
import { searchConditionRouter } from './routes/search-condition';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json({limit: '50mb'}));
    this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    mongoose.Promise = global.Promise;
  }

  private routes(): void {
    // 静的資産へのルーティング
    this.express.use(express.static(path.join(__dirname, 'public')));

    this.express.use('/api/authenticate', authenticateRouter);

    this.express.use(authenticate.verifyToken);


    this.express.use('/api/users', userRouter);
    this.express.use('/api/articles', articleRouter);
    this.express.use('/api/comments', commentRouter);
    this.express.use('/api/searchconditions', searchConditionRouter);

    // その他のリクエストはindexファイルにルーティング
    this.express.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });
  }
}

export default new App().express;
