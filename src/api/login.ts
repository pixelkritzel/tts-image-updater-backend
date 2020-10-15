import { User } from './../entity/User';
import express from 'express';

export const router = express.Router();

export const login = router.post('/', async (req, res) => {
  const { username, password } = req.body as { [key: string]: unknown };
  if (typeof username === 'string' && typeof password === 'string') {
    const user = await User.findOne({ name: username })
    if (user) {
      const result = await user.login(password);
      if (result.type === 'ERROR') {
        res.statusCode = 401;
        res.send(result.message);
      } else {
        res.send({ message: result.message, token: result.data?.sessionToken });
      }
    } else {
      res.statusCode = 401;
      res.send();
    }
  } else {
    res.statusCode = 400;
    res.send();
  }
});
