import promisePool from '../utils/database.js';

const listAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT user_id, username, email, user_level, created_at FROM Users');
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

const findUserById = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT user_id, username, email, user_level, created_at FROM Users WHERE user_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

const addUser = async (user) => {
  const { username, password, email } = user;
  const sql = `INSERT INTO Users (username, password, email) VALUES (?, ?, ?)`;
  const params = [username, password, email];
  try {
    const [rows] = await promisePool.execute(sql, params);
    return { user_id: rows.insertId };
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

export { listAllUsers, findUserById, addUser };