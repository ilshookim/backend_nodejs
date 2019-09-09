require('should')
const request = require('supertest')
const app = require('../app')
const db = require('../../db/db')
const seeding = require('../../db/seeds/development/users')

describe('CHK database', function () {
  it('데이터베이스를 준비한다', function (done) {
    seeding.seed(db)
    done()
  })
})

describe('GET /api/users', function () {
  context('성공한 경우', function () {
    it('배열을 반환한다', function (done) {
      request(app)
        .get('/api/users/')
        .end(function (_err, res) {
          // console.log(res.body)
          res.body.should.be.instanceof(Array)
          res.body.forEach(function (user) {
            user.should.have.property('name')
          })
          done()
        })
    })
    it('최대 limit 갯수만큼 응답한다', function (done) {
      const limit = 2
      request(app)
        .get(`/api/users?limit=${limit}`)
        .end(function (_err, res) {
          res.body.should.have.lengthOf(limit)
          done()
        })
    })
  })

  context('실패한 경우', function () {
    it('limit이 정수가 아니면 400 응답한다', function (done) {
      request(app)
        .get('/api/users?limit=two')
        .expect(400)
        .end(done)
    })
  })
})

describe('GET /api/users/:id', function () {
  context('성공한 경우', function () {
    it('유저 객체를 반환한다', function (done) {
      const id = 1
      request(app)
        .get(`/api/users/${id}`)
        .end(function (_err, res) {
          // console.log(res.body)
          res.body.should.have.property('id', id)
          done()
        })
    })
  })

  context('실패한 경우', function () {
    it('id가 정수가 아니면 400 응답한다', function (done) {
      request(app)
        .get('/api/users/two')
        .expect(400)
        .end(done)
    })
    it('찾을 수 없는 id일 경우 404 응답한다', function (done) {
      const id = 5
      request(app)
        .get(`/api/users/${id}`)
        .expect(404)
        .end(done)
    })
  })
})

describe('POST /api/users', function () {
  context('성공한 경우', function () {
    it('201 응답, 생성한 유저 객체를 응답한다', function (done) {
      request(app)
        .post('/api/users').send({ name: 'Daniel' })
        .expect(201)
        .end(function (_err, res) {
          // console.log(res.body)
          res.body.should.have.property('name', 'Daniel')
          done()
        })
    })
  })

  context('실패한 경우', function () {
    it('name이 없으면 400 응답한다', function (done) {
      request(app)
        .post('/api/users').send({})
        .expect(400)
        .end(done)
    })

    it('name이 중복이면 409 응답한다', function (done) {
      request(app)
        .post('/api/users').send({ name: 'Alice' })
        .expect(409)
        .end(done)
    })
  })
})

describe('PUT /api/users', function () {
  context('성공한 경우', function () {
    it('204 응답한다', function (done) {
      const id = 2
      request(app)
        .put(`/api/users/${id}`).send({ name: 'Joshua' })
        .expect(204)
        .end(done)
    })
  })

  context('실패한 경우', function () {
    it('id가 정수가 아니면 400 응답한다', function (done) {
      request(app)
        .put('/api/users/two')
        .expect(404)
        .end(done)
    })
    it('찾을 수 없는 id일 경우 404 응답한다', function (done) {
      const id = 5
      request(app)
        .put(`/api/users/${id}`).send({ name: 'Joshua' })
        .expect(404)
        .end(done)
    })
  })
})

describe('DELETE /api/users/:id', function () {
  context('성공한 경우', function () {
    it('204 응답한다', function (done) {
      const id = 1
      request(app)
        .delete(`/api/users/${id}`)
        .expect(204)
        .end(done)
    })
  })

  context('실패한 경우', function () {
    it('id가 정수가 아니면 400 응답한다', function (done) {
      request(app)
        .delete('/api/users/two')
        .expect(400)
        .end(done)
    })
    it('찾을 수 없는 id일 경우 404 응답한다', function (done) {
      const id = 5
      request(app)
        .delete(`/api/users/${id}`)
        .expect(404)
        .end(done)
    })
  })
})
