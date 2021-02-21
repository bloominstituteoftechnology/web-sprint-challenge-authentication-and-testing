// Write your tests here
const request = require("supertest");
const db = require('../data/dbConfig.js');
const server = require("./server");


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
})

const user1 = {
  username: "austin",
  passsword: "password"
};


test('sanity', () => {
  expect(true).toBe(true)
});

describe("Testing that all endpoints work", () => {
  describe("Testing the api/auth/register works", () => {
    test("Should create a new user", async () => {
      let res = await request(server).post("/api/auth/register").send(user1);

      expect(res.body.username).toBe("austin");
      expect(res.body.id).toBe(1);
      expect(res.body.passsword).toBe("password");
    })

    test("Should return a 401 error code", async () => {
      let res = await request(server)
      .post("/api/aith/register").send(user1).expect(401);
    })
  })

describe("Test that api/auth/login works", () => {
  beforeEach(async () => {
    await request(server).post('/api/auth/login').send(user1)
  })

  test("Token is returned upon registration", async () => {
    let res = await request(server).post('/api/auth/login').send(user1);

    expect(res.body.token).toBeDefined();
})

})
describe("Test that api/auth/jokes works", () => {
  describe("Testing GET api/jokes", () => {
    let res;
    beforeEach(async () => {
      await request(server).post('/api/auth/register').send(user1);
    })
    test("User can login and view jokes", async () => {
      res = await request(server).post('/api/auth/login').send(user1);
      let res1 = await request(server)
      .get("/api/jokes").set("Authorization", res.body.token).expect(200)
    })
  })
})

})
