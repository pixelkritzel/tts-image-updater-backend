import { types, flow, getSnapshot } from 'mobx-state-tree';

import { userModel, SOuser } from './user';
import { hashPassword } from '../utils/hashPassword';
import { loadUsers } from '../utils/loadUsers';

const storeData = require('../../data/store.json');

type storeResponse = { type: 'ERROR'; message: string } | { type: 'SUCCESS'; message: string };

const storeModel = types
  .model('store', {
    users: types.map(userModel),
  })
  .actions((self) => ({
    addUser: flow(function* (name: string, password: string) {
      if (self.users.get(name)) {
        return { type: 'ERROR', message: 'User already exists' };
      }
      const pwHash = (yield hashPassword(password)) as string;
      self.users.set(name, userModel.create({ name, pwHash }));
      return { type: 'SUCCESS', message: 'User created' };
    }) as (name: string, password: string) => Promise<storeResponse>,

    afterCreate: flow(function* () {
      const users = (yield loadUsers()) as SOuser[];
      users.forEach((user) => self.users.set(user.name, user));
    }),
  }));

export const store = storeModel.create(storeData);
