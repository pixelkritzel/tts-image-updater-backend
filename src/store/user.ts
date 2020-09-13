import { types, SnapshotOut, getSnapshot, flow, Instance, onSnapshot } from 'mobx-state-tree';
import path from 'path';
import fsWithCallbacks from 'fs';

import filenamify from 'filenamify';
import { compare } from 'bcrypt';
import { v4 as uuid4 } from 'uuid';

import { imageSetModel } from './imageSet';

const fs = fsWithCallbacks.promises;

const ONE_DAY_IN_MILLISECONDS = 86400000;

async function saveUserSnapshot(snapshot: SOuser) {
  const userPath = path.resolve(process.cwd(), `./data/users/${filenamify(snapshot.name)}.json`);
  fs.writeFile(userPath, JSON.stringify(snapshot), 'utf-8');
}

const sessionModel = types.model('session', {
  expires: types.number,
  token: types.string,
});

export type Isession = Instance<typeof sessionModel>;

export const userModel = types
  .model('user', {
    name: types.identifier,
    pwHash: types.string,
    session: types.maybe(sessionModel),
    imageSets: types.map(imageSetModel),
  })
  .actions((self) => {
    const disposers: Function[] = [];

    function afterCreate() {
      saveUserSnapshot(getSnapshot(self));
      disposers.push(onSnapshot(self, saveUserSnapshot));
    }

    function beforeDestroy() {
      disposers.forEach((fn) => fn);
    }

    return {
      afterCreate,
    };
  })
  .actions((self) => ({
    login: flow(function* (password: string) {
      if (yield compare(password, self.pwHash)) {
        const now = Date.now();
        self.session = {
          expires: now + ONE_DAY_IN_MILLISECONDS * 7,
          token: uuid4(),
        };
        return { type: 'SUCCESS', data: {} };
      } else {
        return { type: 'ERROR', message: 'Wrong password' };
      }
    }),
    logout() {
      self.session = undefined;
    },
  }));

export type Iuser = Instance<typeof userModel>;
export type SOuser = SnapshotOut<typeof userModel>;
