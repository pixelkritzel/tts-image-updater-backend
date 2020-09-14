import { users } from './api/users';
import { logout } from './api/logout';
import { login } from './api/login';
import { signup } from './api/signup';
import express from 'express';
import dotenv from 'dotenv';
const app = express();
const port = 3000;

dotenv.config();

app.use(express.urlencoded());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('content-type', 'application/json');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
