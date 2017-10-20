

 class ValidateHelper {
  PATTERN = {
    HANKAKUEISU: /^[a-zA-Z\d]*$/,
    PASSWORD: /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,30}$/i
  };

  MESSAGE = {
    required: '{0}を入力してください',
    minlength: '{0}は{1}桁以上にしてください',
    maxlength: '{0}は{1}桁以下にしてください',
    passwordMatch: 'パスワードと確認用パスワードが一致しません',
    pattern_hankakueisuji: '{0}は半角英数字で入力してください',
    pattern_password: '{0}は半角英数字記号をそれぞれ1種類以上含む8文字以上30文字以下にしてください',
    allready_existed: '指定した{0}は既に使用されています',
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
