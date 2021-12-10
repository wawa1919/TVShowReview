// Imports the server.js file to be tested.
const server = require("../server");
// Assertion (Test Driven Development) and Should,  Expect(Behaviour driven 
// development) library
const chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe("Server!", () => {

  it("Loaded TV Show Data", (done) => {
    chai 
      .request(server)
      .get("/shows?q=show")
      .end((err,res) => {
        expect(res.body).to.be.a("object");
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("No TV Show ID", (done) => {
    chai 
      .request(server)
      .get("/shows?q=")
      .end((err,res) => {
        expect(res.body).to.be.a("object");
        expect(res.status).to.equal(400);
        done();
      });
  });
});
