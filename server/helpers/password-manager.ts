
import * as bcrypt from 'bcryptjs';
import { systemLogger } from '../logger';

/**
 * パスワードを暗号化、比較するためのユーティルクラス
 */
const PasswordManager = {

  crypt: (password): String => {
    return bcrypt.hashSync(password, 10);
  },

  compare: (plainPass, hashword): Boolean => {
    systemLogger.debug('パスワードを比較します');
    systemLogger.debug('bcrypt = ' + bcrypt);
    if (bcrypt) {
      systemLogger.debug('bcrypt.compareSync = ' + bcrypt.compareSync);
    }
    return bcrypt.compareSync(plainPass, hashword);
  }

};

export { PasswordManager };
