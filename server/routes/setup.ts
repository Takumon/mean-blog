import * as http from 'http';
import { Router, Response } from 'express';
import { User } from '../models/user';

const setupRouter: Router = Router();

setupRouter.get('/', function(req, res) {

  const takumon = new User({
    userId: 'takumon',
    password: 'takumontakumon',
    email: 'inouetakumon@gmail.com',
    firstName: 'Takuto',
    lastName: 'Inoue',
    isAdmin: true,
    blogTitle: 'Takumonaa\'s blog',
    userDescription: 'Tokyo Fukuoka'
  });


  takumon.save(function(err, result) {
    if (err) {
      throw err;
    }

    res.json({
      success: true,
      user: result
    });
  });
});

export { setupRouter };
