import express from 'express';
import { getEntries, getEntryById } from '../controllers/entry-controller.js';

const entryRouter = express.Router();

// Matches GET requests to /api/entries
entryRouter.route('/')
  .get(getEntries);

// Matches GET requests to /api/entries/:id
entryRouter.route('/:id')
  .get(getEntryById);

export default entryRouter;