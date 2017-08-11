import * as mongoose from 'mongoose';
import '../connection';

const UserSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: [true, 'ユーザIDは必須です。']
  },
  password: {
    type: String,
    required: [true, 'ユーザIDは必須です。']
  },
  email: {
    type: String,
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  blogTitle: {
    type: String
  },
  userDescription: {
    type: String
  }
});

const User = mongoose.model('User', UserSchema);

export { User };