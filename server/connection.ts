import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';

import { MONGO_URL } from './config';

// 接続する MongoDB の設定
const connection = mongoose.connect(process.env.MONGO_URL || MONGO_URL, {
  useMongoClient: true,
});
autoIncrement.initialize(connection);

process.on('SIGINT', function() { mongoose.disconnect(); });

export { connection };
