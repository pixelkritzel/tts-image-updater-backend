import { Session } from './../entity/Session';
import express from 'express';

export const router = express.Router();

export const logout = router.delete('/', async (req, res) => {
  const sessionToken = req.headers['session-token'] as string;
  const session = await Session.findOne({ sessionToken })
  if (session) {
    await session.remove();
  }
  res.send();
});
