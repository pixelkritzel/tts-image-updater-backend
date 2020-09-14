import { IAnyStateTreeNode } from 'mobx-state-tree';

export type storeResponse =
  | { type: 'ERROR'; message?: string; data?: IAnyStateTreeNode | { [key: string]: any } }
  | { type: 'SUCCESS'; message?: string; data?: { [key: string]: any } };
