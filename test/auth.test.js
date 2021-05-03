const expect = require("expect");
const request = require("supertest");
if (require("dotenv")) require("dotenv").config();

const { app } = require("../server");

// Register tests
describe("POST /api/auth/register/", () => {
  it("should return input validation errors", (done) => {
    request(app)
      .post("/api/auth/register/")
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toEqual(
          expect.arrayContaining([
            "Please enter a valid email address",
            "Please enter a password at least 8 characters long and contain minimum 1 uppercase letter, 2 lowercase letters, 2 digits and 1 symbol.",
          ])
        );
      })
      .end(done);
  });
});

// Login Tests
describe("POST /api/auth/login/", () => {
  it("Should return input validation errors", (done) => {
    request(app)
      .post("/api/auth/login")
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toEqual(
          expect.arrayContaining([
            "Invalid credentials, please make sure you typed everything correctly",
          ])
        );
      })
      .end(done);
  });

  it("Should return invalid credentials error", (done) => {
    request(app)
      .post("/api/auth/login")
      .send({ email: "random.mail@randommail.com", password: "randompasS12-" })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toEqual(
          expect.arrayContaining([
            "Invalid credentials, please make sure you typed everything correctly",
          ])
        );
      })
      .end(done);
  });

  // TODO: make sure you have set USER_EMAIL and PASSWORD in .env file or as parameters on the cli
  it("Should return user details and token", (done) => {
    request(app)
      .post("/api/auth/login")
      .send({
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.user).toBeDefined();
        expect(res.body.token).toBeDefined();
      })
      .end(done);
  });
});
