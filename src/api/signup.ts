import { store } from './../store/store';
import express from 'express';
import bodyParser from 'body-parser';
export const router = express.Router();

export const signup = router.post('/', async (req, res) => {
  const { username, password } = req.body as { [key: string]: unknown };
  if (typeof username === 'string' && typeof password === 'string') {
    const result = await store.addUser(username, password);
    if (result.type === 'ERROR') {
      res.statusCode = 409;
      res.send(result.message);
    } else {
      res.send(result.message);
    }
  } else {
    res.statusCode = 400;
    res.send();
  }
});
