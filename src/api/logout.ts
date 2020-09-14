import express from 'express';

import { store } from './../store/store';

export const router = express.Router();

export const logout = router.delete('/', async (req, res) => {
  const sessionToken = req.headers['session-token'] as string;
  const sessionByToken = store.activeSessions.get(sessionToken);
  if (sessionByToken) {
    store.users.get(sessionByToken.username)!.logout();
  }
  res.send();
});
