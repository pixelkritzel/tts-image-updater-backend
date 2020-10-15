import express from 'express';

import { User } from './../entity/User';
import { hash } from './../utils/hashPassword';

export const router = express.Router();

export const signup = router.post('/', async (req, res) => {
  const existingUser = await User.findOne({ name: req.body.name });
  if (existingUser) {
    res.statusCode = 409;
    res.send('User already exists');
    return;
  }
  const { username: name, password } = req.body;
  try {
    const pwHash = await hash(password);
    const newUser = new User(name, pwHash);
    await newUser.save();
    res.json(newUser);
  } catch (e) {
    console.error(e)
    res.statusCode = 400;
    res.send();
  }
});
