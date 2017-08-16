import * as http from 'http';
import { Router, Response } from 'express';
import { Article } from '../models/article';

const articleRouter: Router = Router();

// 全記事を取得する
articleRouter.get('/', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc);
  };

  const query = req.query;
  const condition = query.condition ?
    JSON.parse(query.condition) :
    {};

  if (query.withUser) {
    Article
      .find(condition)
      .populate('author', '-password')
      .populate('comments.user', '-password')
      .exec(cb);
  } else {
    Article
      .find(condition);
  }
});

// 指定したIDの記事を取得する
articleRouter.get('/:id', (req, res, next) => {
  const cb = (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }
    return res.status(200).json(doc[0]);
  };


  if (req.query.withUser) {
    Article
      .find({ articleId: +req.params.id })
      .populate('author', '-password')
      .populate('comments.user', '-password')
     .exec(cb);
  } else {
    Article
      .find({ articleId: +req.params.id }, cb);
  }
});

// 記事を登録する
articleRouter.post('/', (req, res, next) => {
  const article = new Article(req.body);

  article.save((err, result) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: '記事を登録しました。',
      obj: result
    });
  });
});

// 記事を更新する
articleRouter.put('/:id', (req, res, next) => {
  Article.update({
    articleId: req.params.id
  }, req.body, (err, result) => {

    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    return res.status(200).json({
      message: '記事を更新しました。',
      obj: result
    });
  });
});

// 記事を削除する
articleRouter.delete('/:id', (req, res, next) => {
  Article.findOne({ articleId: req.params.id }, (err, model) => {

    if (err) {
      return res.status(500).json({
        title: '削除しようとした記事(articleId=${req.params.id})は見つかりませんでした。',
        error: err.message
      });
    }

    model.remove(err2 => {
      if (err2) {
        return res.status(500).json({
            title: 'エラーが発生しました。',
            error: err.message
        });
      }

      return res.status(200).json({
        message: '記事を削除しました。',
      });
    });
  });
});





// 指定したIDの記事にコメントを追加する
articleRouter.post('/:id/comments', (req, res, next) => {

  // TODO 入力チェック、権限チェック
  const condition = { articleId: +req.params.id };
  const update = { $push : { comments: req.body} };
  const options = { new: true, safe: true };

  Article.findOneAndUpdate(condition, update, options, (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    res.status(200).json({
      message: '記事にコメントを登録しました。',
      obj: doc
    });
  });
});

// 指定したIDのコメントを更新する
articleRouter.put('/:articleId/comments/:commentId', (req, res, next) => {

  // TODO 入力チェック、権限チェック
  const condition = {
    articleId: +req.params.articleId,
    'comments._id': req.params.commentId
  };
  const update = { $set : {
    'comments.$.text': req.body.text,
    'comments.$.isMarkdown': req.body.isMarkdown,
    'comments.$.updated': new Date(),
  } };
  const options = {new : true};

  Article.findOneAndUpdate(condition, update, options, (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    res.status(200).json({
      message: '記事のコメントを更新しました。',
      obj: doc
    });
  });
});


// 指定したIDのコメントを削除する
articleRouter.delete('/:articleId/comments/:commentId', (req, res, next) => {

  // TODO 入力チェック、権限チェック
  const condition = { articleId: +req.params.articleId };
  const update = { $pull : { comments : { _id: req.params.commentId} } };
  const options = {new : true};

  Article.findOneAndUpdate(condition, update, options, (err, doc) => {
    if (err) {
      return res.status(500).json({
          title: 'エラーが発生しました。',
          error: err.message
      });
    }

    res.status(200).json({
      message: '記事のコメントを削除しました。',
      obj: doc
    });
  });
});

export { articleRouter };
