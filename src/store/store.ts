import { IimageSet } from './imageSet';
import { types, flow } from 'mobx-state-tree';
import fsWithCallbacks from 'fs';

import { userModel, Isession, Iuser, SIuser } from './user';
import { hash } from '../utils/hashPassword';
import { loadUsers } from '../utils/loadUsers';
import { storeResponse } from './storeResponse';
import { getUserDataPath } from '../utils/getUserDataPath';

const storeData = require('../../data/store.json');

const fs = fsWithCallbacks.promises;

async function deleteUserData(username: string) {
  await fs.unlink(getUserDataPath(username));
}

const storeModel = types
  .model('store', {
    users: types.map(userModel),
  })
  .views((self) => ({
    get activeSessions() {
      const activeSessions = new Map<
        Isession['token'],
        { username: Iuser['name']; expires: number }
      >();
      for (const [, user] of self.users) {
        if (user.session) {
          activeSessions.set(user.session.token, {
            username: user.name,
            expires: user.session.expires,
          });
        }
      }
      return activeSessions;
    },

    getImageSetById(imageSetId: string) {
      let imageSet: IimageSet | undefined;
      self.users.forEach((user) => {
        user.imageSets.forEach((currentImageSet) => {
          if (currentImageSet.id === imageSetId) {
            imageSet = currentImageSet;
          }
        });
      });
      return imageSet;
    },
  }))
  .actions((self) => {
    let cleanupSessionsIntervalId: NodeJS.Timeout;

    function cleanupExpiredSessions() {
      const now = Date.now();
      const usersWithExpiredSessions: Iuser[] = [];
      self.activeSessions.forEach((sessionByToken) => {
        if (sessionByToken.expires < now) {
          usersWithExpiredSessions.push(self.users.get(sessionByToken.username)!);
        }
      });
      usersWithExpiredSessions.forEach((user) => {
        user.logout();
      });
    }

    const afterCreate = flow(function* () {
      const users: SIuser[] = yield loadUsers();
      users.forEach((user) => self.users.set(user.name, user));
      cleanupSessionsIntervalId = setInterval(cleanupExpiredSessions, 5 * 60 * 1000);
    });

    function beforeDestroy() {
      clearInterval(cleanupSessionsIntervalId);
    }

    return {
      afterCreate,
    };
  })
  .actions((self) => ({
    addUser: flow(function* (name: string, password: string) {
      if (self.users.get(name)) {
        return { type: 'ERROR', message: 'User already exists' } as storeResponse;
      }
      const pwHash = (yield hash(password)) as string;
      self.users.set(name, userModel.create({ name, pwHash }));
      return { type: 'SUCCESS', message: 'User created' } as storeResponse;
    }),

    deleteUser(user: Iuser) {
      deleteUserData(user.name);
      self.users.delete(user.name);
    },
  }));

export const store = storeModel.create(storeData);
