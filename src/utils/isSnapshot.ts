import { IAnyModelType, SnapshotIn, typecheck } from 'mobx-state-tree';

export function isSnapshot<T extends IAnyModelType>(model: T, data: any): data is SnapshotIn<T> {
  let result = true;
  try {
    typecheck(model, data);
  } catch (_) {
    result = false;
  }
  return result;
}
