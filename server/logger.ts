import * as log4js from 'log4js';
import * as config from 'config';

log4js.configure(config.log4js);

// ログ出力
export const systemLogger = log4js.getLogger('system');
export const accessLogger = log4js.getLogger('access');
export const errorLogger = log4js.getLogger('error');

/**
 * リクエストとレスポンスの情報をログに出力する
 *
 * @param req リクエスト
 * @param res レスポンス
 * @param next
 */
export function accessLogHandler (req, res, next) {
  const start = new Date();
  accessLogger.info([
    'start',
    req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    req.method,
    req.url,
    '-',
    req.headers.referer || '-',
    req.headers['user-agent'] || '-',
    '--ms--'
  ].join(',\t'));

  res.once('finish', function() {
    accessLogger.info([
      'end',
      req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      req.method,
      req.url,
      res.statusCode,
      req.headers.referer || '-',
      req.headers['user-agent'] || '-',
      '--' + (new Date().getMilliseconds() - start.getMilliseconds()) + 'ms--'
    ].join(',\t'));
  });

  next();
}

