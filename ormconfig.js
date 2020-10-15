function rootDirectoryByEnvironment() {
  return process.env.NODE_ENV === 'production' ? 'dist' : 'src';
}

function extensionByEnvironment() {
  return process.env.NODE_ENV === 'production' ? 'js' : 'ts';
}

module.exports = {
  type: 'better-sqlite3',
  database: './db/database.db',
  synchronize: true,
  logging: false,
  entities: [`${rootDirectoryByEnvironment()}/entity/**/*.${extensionByEnvironment()}`],
  migrations: [`${rootDirectoryByEnvironment()}/migration/**/*.${extensionByEnvironment()}`],
  subscribers: [`${rootDirectoryByEnvironment()}/subscriber/**/*.${extensionByEnvironment()}`],
  cli: {
    entitiesDir: `${rootDirectoryByEnvironment()}/entity`,
    migrationsDir: `${rootDirectoryByEnvironment()}/migration`,
    subscribersDir: `${rootDirectoryByEnvironment()}/subscriber`,
  },
};
