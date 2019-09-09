
module.exports = {

  development: {
    client: 'sqlite3',
    debug: true,
    connection: {
      filename: './dev.sqlite3'
    },
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds/development`
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'mysql',
    debug: true,
    connection: {
      host: '192.168.0.78',
      user: 'root',
      password: 'next.123',
      database: 'test',
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds/staging`
    }
  },

  production: {
    client: 'mysql',
    debug: true,
    connection: {
      host: '192.168.0.78',
      user: 'root',
      password: 'next.123',
      database: 'test',
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds/production`
    }
  }

}
