import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { users } from './api/users';
import { logout } from './api/logout';
import { login } from './api/login';
import { signup } from './api/signup';

import { exclude } from './utils/exclude';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(
  exclude('/images', (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    next();
  })
);

app.use('/images', express.static(path.resolve(process.cwd(), 'images')));

app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
