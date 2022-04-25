import cors from 'cors';
import express from 'express';

import { seedUserStore } from './database';
import { route } from './routes';

const app = express();

app.use(express.json());
app.use(cors())
seedUserStore();
app.use(route);

app.listen(3333, () => console.log('Server is running'));