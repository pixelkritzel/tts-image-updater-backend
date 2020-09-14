import { store } from './../store/store';
import express from 'express';

export const router = express.Router();

export const logout = router.delete('/', async (req, res) => {
  const sessionToken = req.headers['session-token'] as unknown;
  const sessionByToken = store.activeSessions.get(sessionToken as string);
  if (sessionByToken) {
    store.users.get(sessionByToken.username)!.logout();
  }
  res.send();
});
