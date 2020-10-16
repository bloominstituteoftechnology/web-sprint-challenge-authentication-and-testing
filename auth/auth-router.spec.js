const { expectCt } = require("helmet");
const supertest = require("supertest");
const server = require("../api/server");

//User needs to be different on each register
const user = {
  username: "Plato",
  password: "hey",
};
let token;

describe("server.js", () => {
  describe("Registers and Logs in", () => {
    // creates a new user
    it.skip("should Register", () => {
      return supertest(server)
        .post("/api/auth/register")
        .send(user)
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
    //Logs in
    it("should Login", () => {
      return supertest(server)
        .post("/api/auth/login")
        .send(user)
        .then((res) => {
          expect(res.status).toBe(200);
          token = res.body.token;// sets the token to use later
        });
    });
  });
  describe("API/JOKES status 200", () => {
    // passing no token
    it("should get 401 ok", () => {
      return supertest(server)
        .get("/api/jokes")
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });
    //passing a token
    it("should get 200 ok", () => {
      return supertest(server)
        .get("/api/jokes")
        .set("Authorization", `${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
  });
});
