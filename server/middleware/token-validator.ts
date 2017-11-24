
import * as jwt from 'jsonwebtoken';
import * as config from '../config';

const tokenValidator = {

  verify: ( (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
      res.status(403).send({ errors: [{
        msg: 'ログインが必要な操作です。'
      }]});
      return;
    }

    jwt.verify(token, config.SECRET, (err, decoded) => {
      if (err) {
        if (err.message === 'jwt expired') {
          return res.status(403).json({ errors: [{
            msg: '認証トークンが期限切れです。'
          }]});
        }

        return res.status(403).json({ errors: [{
          msg: 'ログインが必要な操作です。'
        }]});
      }

      req.decoded = decoded;
      next();
    });
  })
};


export { tokenValidator };
