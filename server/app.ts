import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';
import * as morgan from 'morgan';

import * as config from './config';
import { authenticateRouter } from './routes/authenticate';
import { authenticate } from './middleware/authenticate';
import { articleRouter } from './routes/article';
import { draftRouter } from './routes/draft';
import { commentRouter } from './routes/comment';
import { replyRouter } from './routes/reply';
import { userRouter } from './routes/user';
import { imageRouter } from './routes/image';
import { searchConditionRouter } from './routes/search-condition';
import { ROOT_USER_ID, ROOT_USER_PASSWORD } from './config';
import { PasswordManager } from './helpers/password-manager';
import { Image, ImageType } from './models/image';

import { User } from './models/user';


console.log('設定値の値');
console.log(config);

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.initDB();
  }

  private middleware(): void {
    if (this.express.get('env') === 'production') {
      this.express.use(morgan());
    } else {
      this.express.use(morgan({ format: 'dev', immediate: false }));
    }
    this.express.use(bodyParser.json({limit: '50mb'}));
    this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    mongoose.Promise = global.Promise;
  }

  private routes(): void {
    // 静的資産へのルーティング
    this.express.use(express.static(path.join(__dirname, 'public')));
    // api系のリクエストでない場合はindexファイルにルーティング
    this.express.use(/^(?!\/api\/).*$/, (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });

    // 認証不要のAPI
    this.express.use('/api/authenticate', authenticateRouter);
    this.express.use('/api/images', imageRouter);

    // データ参照以外の操作は認証が必要なAPI
    this.express.post(/^\/api\/.*$/, authenticate.verifyToken);
    this.express.put(/^\/api\/.*$/, authenticate.verifyToken);
    this.express.delete(/^\/api\/.*$/, authenticate.verifyToken);


    this.express.use('/api/users', userRouter);
    this.express.use('/api/articles', articleRouter);
    this.express.use('/api/drafts', draftRouter);
    this.express.use('/api/comments', commentRouter);
    this.express.use('/api/replies', replyRouter);
    this.express.use('/api/searchconditions', searchConditionRouter);

    // その他のリクエストはindexファイルにルーティング
    this.express.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });
  }

  // アプリ初期化時に管理者権限のユーザを作成する
  private initDB(): void {
    User
      .findOne({ userId : ROOT_USER_ID })
      .exec((err, user) => {
        if (err) {
          // TODO エラー処理
          console.log('ユーザ検索でエラーが発生しました。', err);
          return;
        }

        if (user) {
          return;
        }

        const rootUser = new User();
        rootUser.userId = config.ROOT_USER_ID;
        rootUser.password = PasswordManager.crypt(config.ROOT_USER_PASSWORD);
        rootUser.isAdmin = true;
        rootUser.save(err2 => {
          if (err2) {
            // TODO エラー処理
            console.log('管理者ユーザ登録時にエラーが発生しました。', err2);
            return;
          }

          // アバター登録
          const rootAvator = new Image({
            author: rootUser._id,
            data: jdenticon.toPng(rootUser.userId, 200),
            contentType: 'image/png',
            fileName: `avator_${rootUser.userId}.png`,
            type: ImageType.AVATOR,
          });

          rootAvator.save((err3) => {
            if (err3) {
              // TODO エラー処理
              console.log('管理者ユーザのアバター登録時にエラーが発生しました。', err3);
              return;
            }
          });
        });
      });

  }
}

export default new App().express;
