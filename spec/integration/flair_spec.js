const   request = require('request'),
        server = require('../../src/server'),
        base = 'http://localhost:3000/flairs',
        sequelize = require('../../src/db/models/index').sequelize,
        Flair = require('../../src/db/models').Flair;

describe("routes : flairs", () => {

    beforeEach((done) => {
        this.flair;
        sequelize.sync({force: true}).then((res) => {

            Flair.create({
                name: "Programming",
                color: "green"
            })
            .then((flair) => {
                this.flair = flair;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });

        });
    });

    describe("GET /flairs", () => {

        it("should return 200 and all flairs", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Flairs");
                expect(body).toContain("Programming");
                done();
            });
        });

    });

    describe("GET /flairs/new", () => {

        it("should render the new flair form", (done) => {
            request.get(`${base}/new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Flair");
                done();
            });
        });

    });

    describe("GET (SHOW) /flairs/:id", () => {

        it("should render the view associated with the id", (done) => {
            request.get(`${base}/${this.flair.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Programming");
                done();
            });
        })

    });

    describe("GET (EDIT) /flairs/:id/edit", () => {

        it("should render the edit form view", (done) => {
            request.get(`${base}/${this.flair.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Flair");
                expect(body).toContain("Programming");
                done();
            });
        });

    });

    describe("POST (UPDATE) /flairs/:id/update", () => {

        it("should update the flair with the new values", (done) => {
            const options = {
                url: `${base}/${this.flair.id}/update`,
                form: {
                    name: "Coding",
                    color: "green"
                }
            };

            request.post(options, (err, res, body) => {
                expect(err).toBeNull();
                Flair.findOne({
                    where: {id: this.flair.id}
                })
                .then((flair) => {
                    expect(flair.name).toBe("Coding");
                    expect(flair.color).toBe("green");
                    done();
                });
            });
        });

    });

    describe("POST /flairs/create", () => {
        const options = {
            url: `${base}/create`,
            form: {
                name: "Sports",
                color: "red"
            }
        }

        it("should create a new topic and redirect", (done) => {
            request.post(options, (err, res, body) => {
                Flair.findOne({where: {name: "Sports"}})
                .then((flair) => {
                    expect(res.statusCode).toBe(303);
                    expect(flair.name).toBe("Sports");
                    expect(flair.color).toBe("red");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

    });

    describe("POST (DESTROY) /flairs/:id/destroy", () => {

        it("should delete the topic with the associated id", (done) => {
            Flair.all()
            .then((flairs) => {
                const flairCountBeforeDelete = flairs.length;
                expect(flairCountBeforeDelete).toBe(1);

                request.post(`${base}/${this.flair.id}/destroy`, (err, res, body) => {
                    Flair.all()
                    .then((flairs) => {
                        expect(err).toBeNull();
                        expect(flairs.length).toBe(flairCountBeforeDelete - 1);
                        done();
                    });
                });
            });
        });

    });

});
