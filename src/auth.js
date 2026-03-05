import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

import { findUserByUsername, toPublicUser } from './users.js';

const postLogin = async (req, res, next) => {
  if (!req.body || typeof req.body !== 'object') {
    const error = new Error('Missing request body');
    error.status = 400;
    return next(error);
  }

  const { username, password } = req.body;

  const user = findUserByUsername(username);
  if (!user) {
    const error = new Error('Invalid username or password');
    error.status = 401;
    return next(error);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error('Invalid username or password');
    error.status = 401;
    return next(error);
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not set on server');
    error.status = 500;
    return next(error);
  }

  const tokenPayload = {
    userId: user.id,
    username: user.username,
    email: user.email
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.json({
    message: 'Login successful!',
    user: toPublicUser(user),
    token
  });
};

const getMe = async (req, res, next) => {
  if (!req.user) {
    const error = new Error('Not authenticated');
    error.status = 401;
    return next(error);
  }

  res.json({ message: 'token ok', user: req.user });
};

export { postLogin, getMe };
