import * as mongoose from 'mongoose';

import * as config from './config';

function createConnection (dbURL, options) {
  const db = mongoose.connect(dbURL, options);

  db.on('error', function (err) {
      // See: https://github.com/Automattic/mongoose/issues/5169
      if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
          console.log(new Date(), String(err));

          setTimeout(function () {
              console.log('Retrying first connect...');
              db.openUri(dbURL).catch(() => {});
          }, config.MONGO_RETRY_INTERVAL * 1000);
      } else {
          // Some other error occurred.  Log it.
          console.error(new Date(), String(err));
      }
  });

  db.once('open', function () {
      console.log('Connection to db established.');
  });

  return mongoose.connection;
}

const connection = createConnection(config.MONGO_URL, {
  useMongoClient: true,
});

process.on('SIGINT', function() { mongoose.disconnect(); });

export { connection };
