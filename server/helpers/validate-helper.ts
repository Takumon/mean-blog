
import { Draft } from '../models/draft';
import { User } from '../models/user';
import { Article } from '../models/article';

class ValidateHelper {
  PATTERN = {
    HANKAKUEISU: /^[a-zA-Z\d]*$/,
    PASSWORD: /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,30}$/i
  };

  MESSAGE = {
    default: 'エラーが発生しました',

    required: '{0}を入力してください',
    minlength: '{0}は{1}桁以上にしてください',
    maxlength: '{0}は{1}桁以下にしてください',
    passwordMatch: 'パスワードと確認用パスワードが一致しません',
    pattern: '{0}は{1}にしてください',
    pattern_hankakueisuji: '{0}は半角英数字で入力してください',
    pattern_password: '{0}は半角英数字記号をそれぞれ1種類以上含む8文字以上30文字以下にしてください',
    pattern_email: '{0}はメール形式で入力してください',
    cannot_allow_change: '{0}は変更できません',
    allready_existed: '指定した{0}は既に使用されています',
    allready_deleted: '指定した{0}は既に削除されています',
    not_existed: '指定した{0}は存在しません',
    different: '{0}と{1}が一致しません',
    login_error: 'ユーザIDかパスワードが正しくありません'
  };

  validation = {
    // 入力チェック用
    isExistedUser: (_id: String): Promise<boolean> => {
      return User
        .findOne({ _id: _id, deleted: { $exists : false }})
        .exec()
        .then(target => {
          if (target) {
            // チェックOK
            return Promise.resolve(true);
          }
          return Promise.reject(false);
        }).catch(err => Promise.reject(false));
    },

    isExistedArticle: (_id: String): Promise<boolean> => {
      return Article
        .findOne({ _id: _id, deleted: { $exists : false }})
        .exec()
        .then(target => {
          if (target) {
            // チェックOK
            return Promise.resolve(true);
          }
          return Promise.reject(false);
        }).catch(err => Promise.reject(false));
    },

    // 投稿済み記事の下書きの場合、記事投稿者と下書き投稿者が一致するか
    isArticleAuthorEqualsAuthor:  (_id: String, {req}): Promise<boolean> => {
      if (req.body.posted !== true) {
        return Promise.resolve(true);
      }

      return Article
        .findOne({ _id: _id, deleted: { $exists : false }})
        .exec()
        .then(target => {
          if (target && target.author.toString() === req.body.author) {
            return Promise.resolve(true);
        }
          return Promise.reject(false);
        }).catch(err => Promise.reject(false));
    },

    isExistedDraft: (_id: String): Promise<boolean> => {
      return Draft
        .findOne({ _id: _id}) // 論理削除はないので単純に_id検索
        .exec()
        .then(target => {
          if (target) {
            // チェックOK
            return Promise.resolve(true);
          }
          return Promise.reject(false);
        }).catch(err => Promise.reject(false));
    }
  };

  message(validationName: string, replacements: Array<string> = []): string {
    let messageTemplate = this.MESSAGE[validationName] || validationName;

    if (!replacements || replacements.length === 0) {
      return messageTemplate;
    }

    replacements.forEach((replacement, index) => {
      messageTemplate = messageTemplate.replace('{' + index + '}', replacement);
    });

    return messageTemplate;
  }
}

export const validateHelper = new ValidateHelper();
