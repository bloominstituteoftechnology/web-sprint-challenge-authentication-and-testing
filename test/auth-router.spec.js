let server = require('../api/server')

let authRouter = require('../auth/auth-router')
let db = require('../database/dbConfig')

describe('POST /login ', () => {
  it('should return status 200 ', async () => {
    let user = {
      username: 'walter4',
      password: 'pass123',
    }
  })

  it('Should give 200 status', async () => {
    let user = {
      username: 'walter4',
      password: 'pass123',
    }
  })
})

describe('auth-router.js', () => {
  beforeEach(async () => {
    await db('users').truncate()
  })

  describe('POST /register', () => {
    it('should return status 201 ', async () => {
      let user = {
        username: 'walter4',
        password: 'pass123',
      }
    })

    it('should give 400 error for no username or password', async () => {
      let user = {
        username: 'noname',
        password: null,
      }
    })
  })

  describe('POST /login', () => {
    it('should return status 401', async () => {
      let user = {
        username: 'walter4',
        password: 'pass123',
      }
    })
  })
})
