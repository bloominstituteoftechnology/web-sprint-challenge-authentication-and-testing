const db = require("../../data/dbConfig");
// const User = require("../users/userswaModel");

describe("User model", () => {
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

  // * * *
  test("Proper database env variable is set", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });

  test("this is an empty test", () => {
    //empty test
  });

  // * * *
  //   describe("insert()", () => {
  //     test("creates a new user", async () => {
  //       const user = await User.insert({ username: "admin" });
  //       expect(user).toMatchObject({ username: "admin" });
  //     });
  //   });

  //   describe("remove()", () => {
  //     test("removes the user from db", async () => {
  //       const { id } = await User.insert({ username: "admin" });
  //       await User.remove(id);
  //       expect(await User.getById(id)).toBeUndefined();
  //     });
  //   });
});
