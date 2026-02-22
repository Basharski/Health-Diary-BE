import promisePool from '../utils/database.js';

const listAllEntries = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM DiaryEntries');
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

const findEntryById = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM DiaryEntries WHERE entry_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

export { listAllEntries, findEntryById };