import * as http from 'http';
import { Router, Response } from 'express';
import { Message } from '../models/message';

const messageRouter: Router = Router();

// 全てのメッセージを取得する
messageRouter.get('/', (req, res, next) => {
  Message.find(function(err, doc) {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({messages: doc});
  });
});

// メッセージを登録する
messageRouter.post('/', (req, res, next) => {
  const message = new Message({
    message: req.body.message
  });

  message.save((err, result) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: 'メッセージを登録しました。',
      obj: result
    });
  });
});

export { messageRouter };
