
import * as bcrypt from 'bcrypt';

const PasswordManager = {

  crypt: (password): String => {
    const result = bcrypt.hashSync(password, 10);
    return result;
  },

  compare: (plainPass, hashword): Boolean => {
    return bcrypt.compareSync(plainPass, hashword);
  }
};


export { PasswordManager };
