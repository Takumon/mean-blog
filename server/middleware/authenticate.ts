
import * as jwt from 'jsonwebtoken';
import { SECRET, TOKEN_EFFECTIVE_SECOND } from '../config';

const authenticate = {

  verifyToken: ( (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
      res.status(403).send({ errors: [{
        msg: 'トークンが存在しません。'
      }]});
      return;
    }

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        if (err.message === 'jwt expired') {
          return res.status(403).json({ errors: [{
            msg: '認証トークンが期限切れです。'
          }]});
        }

        return res.status(403).json({ errors: [{
          msg: 'トークン認証に失敗しました。'
        }]});
      }

      req.decoded = decoded;
      next();
    });
  })
};


export { authenticate };
