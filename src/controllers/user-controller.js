import { listAllUsers, findUserById, addUser } from '../models/user-model.js';

const getUsers = async (req, res) => {
  const result = await listAllUsers();
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  const { username, password, email } = req.body;
  if (username && password && email) {
    const result = await addUser(req.body);
    if (result.user_id) {
      res.status(201).json({ message: 'New user added.', ...result });
    } else {
      res.status(500).json(result);
    }
  } else {
    res.sendStatus(400);
  }
};

export { getUsers, getUserById, postUser };