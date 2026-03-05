// src/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { body } from 'express-validator';
import { getItems, getItemById, postItem, putItem, deleteItem } from './items.js';
import { getUsers, getUserById, postUser, putUser, deleteUser } from './users.js';
import { getEntries, getEntryById, postEntry, putEntry, deleteEntry } from './entries.js';
import { postLogin, getMe } from './auth.js';
import { authenticateToken } from './middlewares/authentication.js';
import { errorHandler, notFoundHandler, validationErrorHandler } from './middlewares/error-handler.js';

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use(cors());
app.use(express.json());

// Return JSON for invalid JSON request bodies
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  next(err);
});

// 1. READ ALL DATA (GET)
app.get('/api/items', getItems);

// 1.5. READ ONE SPECIFIC DATA (GET by ID) - Tämä puuttui aiemmin!
app.get('/api/items/:id', getItemById);

// 2. SEND DATA (POST) - Korvattiin vanha koodi tällä lyhyellä versiolla!
app.post(
  '/api/items',
  body('name', 'name is required').trim().isLength({ min: 1, max: 100 }),
  validationErrorHandler,
  postItem
);

// 3. MODIFY DATA (PUT)
app.put(
  '/api/items/:id',
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  validationErrorHandler,
  putItem
);

// 4. DELETE DATA
app.delete('/api/items/:id', deleteItem);

// --- ENTRIES ROUTES ---
app.get('/api/entries', authenticateToken, getEntries);
app.get('/api/entries/:id', authenticateToken, getEntryById);
app.post(
  '/api/entries',
  authenticateToken,
  body('entry_date', 'entry_date must be a valid date').isISO8601(),
  body('mood').optional({ nullable: true }).trim().isLength({ max: 50 }),
  body('weight').optional({ nullable: true }).isFloat({ min: 0, max: 500 }).toFloat(),
  body('sleep_hours').optional({ nullable: true }).isInt({ min: 0, max: 24 }).toInt(),
  body('notes').optional({ nullable: true }).trim().isLength({ max: 1000 }).escape(),
  validationErrorHandler,
  postEntry
);
app.put(
  '/api/entries/:id',
  authenticateToken,
  body('entry_date').optional({ nullable: true }).isISO8601(),
  body('mood').optional({ nullable: true }).trim().isLength({ max: 50 }),
  body('weight').optional({ nullable: true }).isFloat({ min: 0, max: 500 }).toFloat(),
  body('sleep_hours').optional({ nullable: true }).isInt({ min: 0, max: 24 }).toInt(),
  body('notes').optional({ nullable: true }).trim().isLength({ max: 1000 }).escape(),
  validationErrorHandler,
  putEntry
);
app.delete('/api/entries/:id', authenticateToken, deleteEntry);

// --- USERS ROUTES ---

// Hae kaikki käyttäjät
app.get('/api/users', getUsers);

// Hae käyttäjä ID:llä
app.get('/api/users/:id', getUserById);

// Luo uusi käyttäjä
app.post(
  '/api/users',
  body('username', 'username must be 3-20 characters long and alphanumeric')
    .trim()
    .isLength({ min: 3, max: 20 })
    .isAlphanumeric(),
  body('password', 'minimum password length is 8 characters')
    .trim()
    .isLength({ min: 8, max: 128 }),
  body('email', 'must be a valid email address').trim().isEmail().normalizeEmail(),
  validationErrorHandler,
  postUser
);

// Päivitä käyttäjä (vain oma)
app.put(
  '/api/users/:id',
  authenticateToken,
  body('username').optional().trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
  body('password').optional().trim().isLength({ min: 8, max: 128 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  validationErrorHandler,
  putUser
);

// Poista käyttäjä ID:llä
app.delete('/api/users/:id', deleteUser);

// --- AUTH ROUTES ---
app.post(
  '/api/auth/login',
  body('username', 'username is required').trim().notEmpty(),
  body('password', 'password is required').trim().notEmpty(),
  validationErrorHandler,
  postLogin
);
app.get('/api/auth/me', authenticateToken, getMe);

// Backwards-compatible login alias
app.post(
  '/api/users/login',
  body('username', 'username is required').trim().notEmpty(),
  body('password', 'password is required').trim().notEmpty(),
  validationErrorHandler,
  postLogin
);

// 5. 404 RESPONSE - Catch-all for non-existing resources
app.use(notFoundHandler);

// Add error handler middleware as the last middleware in the chain
app.use(errorHandler);

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});