import express from 'express';
import entryRouter from './routes/entry-router.js';
import userRouter from './routes/user-router.js';

const app = express();
const port = 3000; 

// Middleware to parse incoming JSON data (crucial for your POST requests!)
app.use(express.json());

// Connect the URLs to the routers
app.use('/api/entries', entryRouter);
app.use('/api/users', userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});