import { IJsonPatch } from 'mobx-state-tree';
import { IimageSet } from './imageSet';
export function runImageSetSideEffects(imageSet: IimageSet, patch: IJsonPatch) {
  const path = patch.path.split('/');
  if (patch.op === 'remove' && path[0] === 'images' && path[1]) {
    console.log('Should delete picture file');
  }
}
