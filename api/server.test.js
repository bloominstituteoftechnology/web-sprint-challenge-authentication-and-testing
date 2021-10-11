const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const User = require("./users/usersModel");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

test("sanity", () => {
  expect(true).toBe(true);
});

test("this is an empty test", () => {
  //empty test
});

test("Proper database env variable is set", () => {
  expect(process.env.DB_ENV).toBe("testing");
});

describe("server.js", () => {
  describe("getById()", () => {
    it("retrieves user by ID", () => {});
  });

  describe("[GET] /api/users", () => {
    test("returns an array of users", async () => {
      await db.seed.run();
      const res = await request(server).get("/users");
      // expect(res.body).toHaveLength(2);
      res.body.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
      });
    });
  });

  describe("[POST] /users", () => {
    test("creates a user and return it", async () => {
      const res = await request(server)
        .post("/users")
        .send({ username: "Stan" });
      expect(res.body).toMatchObject({ username: "Stan" });
      expect(await User.getById(res.body.id)).toMatchObject({
        username: "Stan",
      });
    });
  });

  // describe("[PUT] /users/:id", () => {
  //   test("updates the user if it exist", async () => {
  //     const user = await User.insert({ name: "Stan" });
  //     const res = await request(server)
  //       .put(`/users/${user.id}`)
  //       .send({ name: "Stan 1" });

  //     expect(res.body).toMatchObject({ name: "Stan 1" });
  //     expect(await User.getById(user.id)).toMatchObject({ name: "Stan 1" });
  //   });
  //   test(`returns a 404 if the user doesn't exist`, async () => {
  //     return request(server)
  //       .put("/users/123565")
  //       .send({ name: "Stan 1" })
  //       .expect(404, { message: "User not found" });
  //   });
  // });

  // describe("[DELETE] /users/:id", () => {
  //   test("deletes the user if exist", async () => {
  //     const user = await User.insert({ name: "Stan" });
  //     await request(server).delete(`/users/${user.id}`).expect(204);
  //     expect(await User.getById(user.id)).toBeUndefined();
  //   });

  //   test(`returns a 404 if the user doesn't exist`, async () => {
  //     return request(server)
  //       .delete("/users/12345")
  //       .expect(404, { message: "User not found" });
  //   });
  // });
});
