

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
