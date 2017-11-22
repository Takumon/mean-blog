import * as mongoose from 'mongoose';

import * as config from './config';

// 接続する MongoDB の設定
const connection = mongoose.connect(config.MONGO_URL, {
  useMongoClient: true,
});

process.on('SIGINT', function() { mongoose.disconnect(); });

export { connection };
