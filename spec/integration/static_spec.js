const   request = require('request'),
        server = require('../../src/server'),
        base = "http://localhost:3000";

describe("routes : static", () => {

    describe("GET /", () => {
        it("should return status code 200", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body).toBe("Welcome to Bloccit");
                done();
            });
        });

    });

    describe("GET /marco", () => {
        it("should return status code 200 and the message 'polo'", (done) => {
            request.get(base + "/marco", (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body).toBe("polo");
                done();
            });
        });

    });

});
