const logger = require('../../logger')
const config = require('config')
const db = require('../../db/db')

// CRUD: to users

class ErrorCode extends Error {
  constructor (code = 'GENERIC', status = 500, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorCode)
    }

    this.code = code
    this.status = status
  }
}

const creates = function (req, res) {
  db.transaction(async function (sql) {
    const name = req.body.name
    if (!name) {
      throw new ErrorCode('NO_NAME', 400, `failed to parse: name=${name}`)
    }

    const rows = await sql.select('*').from('users').where('name', name)
    logger.debug(rows.length) // 1 | 0
    if (rows.length) {
      throw new ErrorCode('ALREADY_EXISTS', 409, `already exists: rows.length=${rows.length}`)
    }

    const total = await sql.insert({ name: name }).into('users')
    logger.debug(total) // [4]
    if (!total) {
      throw new ErrorCode('NO_INSERT', 404, `failed to insert: total=${total}`)
    }

    res.status(201).json({ total: total, name: name })
  }).catch(function (exc) {
    logger.warn(exc.message)
    let status = 404
    if (exc instanceof ErrorCode) status = exc.status
    res.status(status).end()
  })
}

const reads = function (req, res) {
  db.transaction(async function (sql) {
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)) {
      throw new ErrorCode('NO_NUMBER', 400, `failed to parse: id=${id}`)
    }

    const rows = await sql.select('*').from('users').where('id', id)
    const exists = rows.length
    if (!exists) {
      throw new ErrorCode('NO_EXIST', 404, `failed to select: id=${id}`)
    }

    const user = rows[0]
    logger.debug(user) // { id: 1, name: 'Alice' }
    return res.json(user)
  }).catch(function (exc) {
    logger.warn(exc.message)
    let status = 404
    if (exc instanceof ErrorCode) status = exc.status
    return res.status(status).end()
  })
}

const readsAll = function (req, res) {
  db.transaction(async function (sql) {
    req.query.limit = req.query.limit || config.get('API.users.limit')

    const limit = parseInt(req.query.limit, 10)
    if (Number.isNaN(limit)) {
      throw new ErrorCode('NO_NUMBER', 400, `failed to parse: limit=${limit}`)
    }

    const rows = await sql.select('*').from('users').limit(limit)
    logger.debug(rows) // [ { id: 1, name: 'Alice' }, { id: 2, name: 'Bek' } ]
    return res.json(rows)
  }).catch(function (exc) {
    logger.warn(exc.message)
    let status = 404
    if (exc instanceof ErrorCode) status = exc.status
    return res.status(status).end()
  })
}

const updates = function (req, res) {
  db.transaction(async function (sql) {
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)) {
      throw new ErrorCode('NO_NUMBER', 404, `failed to parse: id=${id}`)
    }

    const name = req.body.name
    if (!name) {
      throw new ErrorCode('NO_NAME', 400, `failed to parse: name=${name}`)
    }

    const updated = await sql.update('name', name).from('users').where('id', id)
    logger.debug(updated) // 1 | 0
    if (!updated) {
      throw new ErrorCode('NO_UPDATE', 404, `failed to update: id=${id}`)
    }

    return res.status(204).end()
  }).catch(function (exc) {
    logger.warn(exc.message)
    let status = 404
    if (exc instanceof ErrorCode) status = exc.status
    return res.status(status).end()
  })
}

const deletes = function (req, res) {
  db.transaction(async function (sql) {
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)) {
      throw new ErrorCode('NO_NUMBER', 400, `failed to parse: id=${id}`)
    }

    const deleted = await sql.del().from('users').where('id', id)
    logger.debug(deleted) // 1 | 0
    if (!deleted) {
      throw new ErrorCode('NO_DELETE', 404, `failed to delete: id=${id}`)
    }

    return res.status(204).end()
  }).catch(function (exc) {
    logger.warn(exc.message)
    let status = 404
    if (exc instanceof ErrorCode) status = exc.status
    return res.status(status).end()
  })
}

module.exports = {
  creates,
  reads,
  readsAll,
  updates,
  deletes
}
