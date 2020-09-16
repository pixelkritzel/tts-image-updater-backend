import fsWithCallbacks from 'fs';
import path from 'path';
import { SIuser } from '../store/user';

const fs = fsWithCallbacks.promises;

export async function loadUsers(): Promise<SIuser[]> {
  const usersDirectory = path.resolve(process.cwd(), `./data/users`);
  const usersPaths = (await fs.readdir(usersDirectory))
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => `${usersDirectory}/${fileName}`);
  const fileContents = await Promise.all(
    usersPaths.map((userPath) => fs.readFile(userPath, 'utf-8'))
  );
  return fileContents.map((content) => JSON.parse(content));
}
