export type storeResponse =
  | { type: 'ERROR'; message?: string; data?: { [key: string]: any } }
  | { type: 'SUCCESS'; message?: string; data?: { [key: string]: any } };
