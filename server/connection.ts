import * as mongoose from 'mongoose';

import { MONGO_URL } from './config';

// 接続する MongoDB の設定
const connection = mongoose.connect(process.env.MONGO_URL || MONGO_URL, {
  useMongoClient: true,
});

process.on('SIGINT', function() { mongoose.disconnect(); });

export { connection };
