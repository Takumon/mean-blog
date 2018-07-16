import * as mongoose from 'mongoose';

import * as ENV from './environment-config';
import { systemLogger, errorLogger } from './logger';

function createConnection (dbURL, options) {
  const db = mongoose.connect(dbURL, options);

  db.then(() => {
    systemLogger.info('Connection to db established.');
  }, err => {
      // See: https://github.com/Automattic/mongoose/issues/5169
      if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
        errorLogger.error(String(err));

        setTimeout(function () {
            errorLogger.info('Retrying first connect...');
            db.openUri(dbURL).catch(() => {});
        }, ENV.MONGO_RETRY_INTERVAL * 1000);
    } else {
        // Some other error occurred.  Log it.
        errorLogger.error(String(err));
    }
  });

  return mongoose.connection;
}

const connection = createConnection(ENV.MONGO_URL, {});

process.on('SIGINT', function() { mongoose.disconnect(); });

export { connection };
