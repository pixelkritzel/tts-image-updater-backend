function rootDirectoryByEnvironment() {
  return process.env.NODE_ENV === 'production' ? 'dist' : 'src';
}

module.exports = {
  type: 'better-sqlite3',
  database: './db/database.db',
  synchronize: true,
  logging: false,
  entities: [`${rootDirectoryByEnvironment()}/entity/**/*.ts`],
  migrations: [`${rootDirectoryByEnvironment()}/migration/**/*.ts`],
  subscribers: [`${rootDirectoryByEnvironment()}/subscriber/**/*.ts`],
  cli: {
    entitiesDir: 'dist/entity',
    migrationsDir: 'dist/migration',
    subscribersDir: 'dist/subscriber',
  },
};
