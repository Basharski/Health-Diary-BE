import express from 'express';
import { getUsers, getUserById, postUser } from '../controllers/user-controller.js';

const userRouter = express.Router();

// Matches GET and POST requests to /api/users
userRouter.route('/')
  .get(getUsers)
  .post(postUser);

// Matches GET requests to /api/users/:id
userRouter.route('/:id')
  .get(getUserById);

export default userRouter;