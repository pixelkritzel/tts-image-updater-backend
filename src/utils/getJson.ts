import { getSnapshot, IAnyStateTreeNode } from 'mobx-state-tree';

export function getJson<T extends IAnyStateTreeNode>(model?: T) {
  if (model) {
    return JSON.stringify(getSnapshot(model));
  } else return '{}';
}
