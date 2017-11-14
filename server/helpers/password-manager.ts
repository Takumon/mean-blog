
import * as bcrypt from 'bcrypt';

/**
 * パスワードを暗号化、比較するためのユーティルクラス
 */
const PasswordManager = {

  crypt: (password): String => {
    return bcrypt.hashSync(password, 10);
  },

  compare: (plainPass, hashword): Boolean => {
    return bcrypt.compareSync(plainPass, hashword);
  }
};

export { PasswordManager };
