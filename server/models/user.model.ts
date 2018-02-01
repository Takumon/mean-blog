import * as mongoose from 'mongoose';
import Schema = mongoose.Schema;
import Document = mongoose.Document;
import Model = mongoose.Model;
import '../connection';

const UserSchema = new Schema({

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
  userName: {
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
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  deleted: { type: Date },
});

export interface UserDocument extends Document {
  userId:  String;
  password: String;
  email?: String;
  userName?: String;
  isAdmin?: Boolean;
  blogTitle?: String;
  userDescription?: String;
  created?: Date;
  updated?: Date;
  deleted?: Date;
}

export const User: Model<UserDocument> = mongoose.model('User', UserSchema);
