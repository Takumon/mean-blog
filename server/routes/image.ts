import * as mongoose from 'mongoose';
import * as http from 'http';
import { Router, Response } from 'express';
import * as multer from 'multer';
import { check, oneOf, body, param, validationResult } from 'express-validator/check';



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

const upload = multer({ storage: multer.memoryStorage() });


// 更新（差分更新）
router.post('/ofArticle', upload.fields([
  { name: 'image', maxCount: 1 },
]), [
  // check('image')
  //   .not().isEmpty().withMessage(v.message(v.MESSAGE_KEY.required, ['画像ファイル']))
], (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }


  // TODO ファイル名重複防ぐため同ファイル名があれば末尾に連番つけて保存

  // アバター登録
  const imageFile = req.files['image'][0];
  console.log(imageFile);
  const image = new Image();
  image.data = imageFile.buffer;
  image.contentType = imageFile.mimetype;
  image.fileName = imageFile.originalname;
  image.type = ImageType.OF_ARTICLE;



  image
  .save((error, target ) => {
    if (error) {
      return res.status(500).json({
          title: v.MESSAGE_KEY.default,
          error: error.message
      });
    }

    return res.status(200).json({
      message: `${MODEL_NAME}を登録しました。`,
      obj: target
    });
  });
});


export { router as imageRouter };
