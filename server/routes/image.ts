import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';


import { User } from '../models/user';
import { Image, ImageType } from '../models/image';
import { validateHelper as v } from '../helpers/validate-helper';


const MODEL_NAME = '画像';
const router: Router = Router();

// アバター取得
router.get('/avator/:userId', (req, res, next) => {

  const condition = {
    author : new mongoose.Types.ObjectId(req.params.userId),
    // author : req.params.userId,
    type: ImageType.AVATOR
  };

  const errorMessage = '指定したユーザIDのアイコンはありません';

  getImage(req, res, next, condition, errorMessage);
});


// プロフィール背景画像取得
router.get('/profileBackground/:userId', (req, res, next) => {

  const condition = {
    author : new mongoose.Types.ObjectId(req.params.userId),
    // author : req.params.userId,
    type: ImageType.PROFILE_BACKGROUND
  };

  const errorMessage = '指定したユーザIDのプロフィール背景画像はありません';

  getImage(req, res, next, condition, errorMessage);
});


function getImage(req, res, next, condition: any, errorMessage: string) {
  Image
  .findOne(condition, (err, image ) => {
    if (err) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: err.message
      });
    }

    if (!image) {
      return res.status(500).json({
        title: v.MESSAGE_KEY.default,
        error: errorMessage
      });
    }

    res
    .status(200)
    .set('Content-Type', image.contentType)
    .send(image.data);
  });

}



export { router as imageRouter };
