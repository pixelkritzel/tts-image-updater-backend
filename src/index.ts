import { login } from './api/login';
import { signup } from './api/signup';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/signup', signup);
app.use('/login', login);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
