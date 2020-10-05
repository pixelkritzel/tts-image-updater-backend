import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { connection } from './api/connection';
import { users } from './api/usersApi';
import { logout } from './api/logout';
import { login } from './api/login';
import { signup } from './api/signup';

import { exclude } from './utils/exclude';

dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(
  exclude(['/images', '/connection'], (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    next();
  })
);

app.use('/images', express.static(path.resolve(process.cwd(), 'images')));

app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/users', users);
app.use('/connection', connection);

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`TTS Auto Updater listening at http://0.0.0.0:${port}`);
});
