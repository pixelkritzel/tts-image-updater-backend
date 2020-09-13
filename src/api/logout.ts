import { store } from './../store/store';
import express from 'express';

export const router = express.Router();

export const logout = router.delete('/', async (req, res) => {
  const sessionToken = req.headers['session-token'] as unknown;
  if (typeof sessionToken === 'string') {
    const userName = store.activeSessions.get(sessionToken);
    if (userName) {
      store.users.get(userName)?.logout();
      res.send();
    }
    res.send();
  }
});
