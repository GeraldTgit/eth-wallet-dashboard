import express from 'express';
import ethereumRoute from './routes/ethereum.js'; // make sure the .js is used if you're using ESModules
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/ethereum', ethereumRoute); // mounts the route

export default app;
