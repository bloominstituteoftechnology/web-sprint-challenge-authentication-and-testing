  
const request = require("supertest");
const server = require("../api/server.js");

let token; 

beforeAll((done) => {
    request(server)
        .post('/api/auth/login')
        .send({
            username: "sandraDee", 
            password: "password"
        })
        .end((err, response) => {
            token = response.body.token;
            done();
        })
})

describe("Hit Jokes endpoint for failure", () => {
  it("should return json type", async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.type).toBe("application/json");
  });
  it("should successfully pass token", async() => {
    const res = await request(server)
        .get("/api/jokes")
        .set("authorization", `${token}`)
    expect(res.status).toBe(200)
  })
});
