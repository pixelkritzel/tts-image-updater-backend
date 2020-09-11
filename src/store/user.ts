import { types, SnapshotOut, getSnapshot, flow } from 'mobx-state-tree';
import path from 'path';
import fsWithCallbacks from 'fs';

import filenamify from 'filenamify';
import { compare } from 'bcrypt';
import { v4 as uuid4 } from 'uuid';

import { imageSetModel } from './imageSet';

const fs = fsWithCallbacks.promises;

async function saveUserSnapshot(snapshot: SOuser) {
  const userPath = path.resolve(process.cwd(), `./data/users/${filenamify(snapshot.name)}.json`);
  fs.writeFile(userPath, JSON.stringify(snapshot), 'utf-8');
}

export const userModel = types
  .model('user', {
    name: types.identifier,
    pwHash: types.string,
    session: types.maybe(
      types.model('session', {
        expires: types.number,
        token: types.string,
      })
    ),
    imageSets: types.map(imageSetModel),
  })
  .actions((self) => ({
    afterCreate() {
      saveUserSnapshot(getSnapshot(self));
    },
    login: flow(function* (password: string) {
      if (yield compare(password, self.pwHash)) {
        const now = Date.now();
        self.session = {
          expires: now + 86400000 * 7,
          token: uuid4(),
        };
        return { type: 'SUCCESS', data: {} };
      } else {
        return { type: 'ERROR', message: 'Wrong password' };
      }
    }),
  }));

export type SOuser = SnapshotOut<typeof userModel>;
