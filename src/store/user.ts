import {
  types,
  SnapshotOut,
  getSnapshot,
  flow,
  Instance,
  onSnapshot,
  SnapshotIn,
} from 'mobx-state-tree';
import fsWithCallbacks from 'fs';
import { compare } from 'bcrypt';
import { v4 as uuid4 } from 'uuid';

import { isSnapshot } from '../utils/isSnapshot';
import { getUserDataPath } from '../utils/getUserDataPath';

import { imageSetModel } from './imageSet';
import { storeResponse } from './storeResponse';

const fs = fsWithCallbacks.promises;

async function saveUserSnapshot(snapshot: SOuser) {
  const userPath = getUserDataPath(snapshot.name);
  fs.writeFile(userPath, JSON.stringify(snapshot, undefined, 4), 'utf-8');
}

function getExpires(): number {
  const SEVEN_DAYS_IN_MILLISECONDS = 86400000 + 7;
  return Date.now() + SEVEN_DAYS_IN_MILLISECONDS;
}

const sessionModel = types
  .model('session', {
    expires: types.number,
    token: types.string,
  })
  .actions((self) => ({
    updateExpires() {
      self.expires = getExpires();
    },
  }));

export type Isession = Instance<typeof sessionModel>;

export const userModel = types
  .model('user', {
    name: types.identifier,
    imageDirectory: uuid4(),
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
    addImageSet(imageSet: unknown): storeResponse {
      if (
        isSnapshot<typeof imageSetModel>(imageSetModel, imageSet) &&
        imageSet.images &&
        imageSet.images.length > 0
      ) {
        const id = uuid4();
        const imageSetInstance = imageSetModel.create({ id, ...imageSet });
        self.imageSets.set(id, imageSetInstance);
        return { type: 'SUCCESS', data: getSnapshot(imageSetInstance) };
      } else {
        return { type: 'ERROR', message: 'ImageSet Type Mismatch' };
      }
    },
    deleteImageSet(imageSetId: string) {
      self.imageSets.delete(imageSetId);
    },
    login: flow(function* (password: string) {
      if (yield compare(password, self.pwHash)) {
        self.session = sessionModel.create({
          expires: getExpires(),
          token: uuid4(),
        });
        return { type: 'SUCCESS', data: {} } as storeResponse;
      } else {
        return { type: 'ERROR', message: 'Wrong password' } as storeResponse;
      }
    }),
    logout() {
      self.session = undefined;
    },
  }));

export type Iuser = Instance<typeof userModel>;
export type SIuser = SnapshotIn<typeof userModel>;
export type SOuser = SnapshotOut<typeof userModel>;
