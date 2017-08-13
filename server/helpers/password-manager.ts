
import * as bcrypt from 'bcrypt';

const PasswordManager = {

  crypt: (password): String => {
    const result = bcrypt.hashSync(password, 10);
    return result;
  },

  compare: (plainPass, hashword): Boolean => {
    const result1 = bcrypt.compareSync(plainPass, hashword);
    return result1;
  }
};


export { PasswordManager };
