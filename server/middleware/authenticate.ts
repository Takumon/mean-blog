
import * as jwt from 'jsonwebtoken';
import { SECRET, TOKEN_EFFECTIVE_SECOND } from '../config';

const authenticate = {

  verifyToken: ( (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
      res.status(403).send({
        success: false,
        message: 'トークンが存在しません。'
      });
      return;
    }

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'トークン認証に失敗しました。'
        });
      }

      req.decoded = decoded;
      next();
    });
  })
};


export { authenticate };
