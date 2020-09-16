import bcrypt from 'bcrypt';
const saltRounds = 10;

export async function hash(password: string) {
  return await bcrypt.hash(password, saltRounds);
}
