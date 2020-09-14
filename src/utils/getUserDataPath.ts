import path from 'path';
import filenamify from 'filenamify';

export function getUserDataPath(username: string) {
  return path.resolve(process.cwd(), `./data/users/${filenamify(username)}.json`);
}
