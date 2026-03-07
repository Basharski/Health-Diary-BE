// AI-avusteinen: tiedoston sisältöä on tarkennettu Copilotin avulla.
// src/entries.js

// Simple in-memory diary entries grouped by userId
// This is demo data; no persistence is used.
const entries = [
  { entry_id: 1, userId: 1, entry_date: '2024-02-01', mood: 'Happy', weight: 70.5, sleep_hours: 8, notes: 'Felt great today!' },
  { entry_id: 2, userId: 1, entry_date: '2024-02-02', mood: 'Tired', weight: 70.2, sleep_hours: 5, notes: 'Did not sleep well.' },
  { entry_id: 3, userId: 2, entry_date: '2024-02-01', mood: 'Stressed', weight: 65.0, sleep_hours: 7, notes: 'Busy day at the office.' },
  { entry_id: 4, userId: 3, entry_date: '2024-02-01', mood: 'Energetic', weight: 80.0, sleep_hours: 9, notes: 'Ready to crush it!' }
];

const nextId = () => (entries.length > 0 ? Math.max(...entries.map(e => e.entry_id)) + 1 : 1);

const filterByUser = (userId) => {
  if (!userId) return entries;
  return entries.filter(e => e.userId == userId);
};

const getEntries = (req, res, next) => {
  if (!req.user) {
    const error = new Error('Missing token');
    error.status = 401;
    return next(error);
  }

  res.json(filterByUser(req.user.userId));
};

const getEntryById = (req, res, next) => {
  const id = req.params.id;
  const entry = entries.find(e => e.entry_id == id);
  if (!entry) {
    const error = new Error('Entry not found');
    error.status = 404;
    return next(error);
  }

  if (!req.user) {
    const error = new Error('Missing token');
    error.status = 401;
    return next(error);
  }

  if (String(entry.userId) !== String(req.user.userId)) {
    const error = new Error('forbidden');
    error.status = 403;
    return next(error);
  }

  res.json(entry);
};

const postEntry = (req, res, next) => {
  if (!req.user) {
    const error = new Error('Missing token');
    error.status = 401;
    return next(error);
  }

  const body = req.body;
  if (!body || typeof body !== 'object') {
    const error = new Error('Missing request body');
    error.status = 400;
    return next(error);
  }

  const { entry_date, mood, weight, sleep_hours, notes } = body;

  const newEntry = {
    entry_id: nextId(),
    userId: req.user.userId,
    entry_date,
    mood: mood ?? null,
    weight: weight ?? null,
    sleep_hours: sleep_hours ?? null,
    notes: notes ?? ''
  };

  entries.push(newEntry);
  res.status(201).json({ message: 'Entry created', entry: newEntry });
};

const putEntry = (req, res, next) => {
  if (!req.user) {
    const error = new Error('Missing token');
    error.status = 401;
    return next(error);
  }

  const id = req.params.id;
  const index = entries.findIndex((e) => e.entry_id == id);
  if (index === -1) {
    const error = new Error('Entry not found');
    error.status = 404;
    return next(error);
  }

  if (String(entries[index].userId) !== String(req.user.userId)) {
    const error = new Error('forbidden');
    error.status = 403;
    return next(error);
  }

  if (!req.body || typeof req.body !== 'object') {
    const error = new Error('Missing request body');
    error.status = 400;
    return next(error);
  }

  const { entry_date, mood, weight, sleep_hours, notes } = req.body;
  const updatedEntry = {
    ...entries[index],
    ...(entry_date ? { entry_date } : {}),
    ...(mood ? { mood } : {}),
    ...(weight !== undefined ? { weight } : {}),
    ...(sleep_hours !== undefined ? { sleep_hours } : {}),
    ...(notes !== undefined ? { notes } : {})
  };

  entries[index] = updatedEntry;

  res.json({ message: `Entry ${id} updated`, entry: updatedEntry });
};

const deleteEntry = (req, res, next) => {
  if (!req.user) {
    const error = new Error('Missing token');
    error.status = 401;
    return next(error);
  }

  const id = req.params.id;
  const index = entries.findIndex(e => e.entry_id == id);
  if (index === -1) {
    const error = new Error('Entry not found');
    error.status = 404;
    return next(error);
  }

  if (String(entries[index].userId) !== String(req.user.userId)) {
    const error = new Error('forbidden');
    error.status = 403;
    return next(error);
  }

  const [removed] = entries.splice(index, 1);
  res.json({ message: `Entry ${id} deleted`, deleted: removed });
};

export { getEntries, getEntryById, postEntry, putEntry, deleteEntry };