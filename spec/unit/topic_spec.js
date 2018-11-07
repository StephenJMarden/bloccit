const   sequelize = require('../../src/db/models/index').sequelize,
        Topic = require('../../src/db/models').Topic,
        Post = require('../../src/db/models').Post,
        User = require('../../src/db/models').User;

describe("topic", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        this.user;

        sequelize.sync({force: true}).then((res) => {

            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Expedition to Alpha Centauri",
                    description: "A compilation of reports from recent visits to the star system.",
                    posts: [{
                        title: "My first visit to Proxima Centauri b",
                        body: "I saw some rocks.",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((topic) => {
                    this.topic = topic;
                    this.post = topic.posts[0];
                    done();
                });
            });

        });
    });

    describe("#create()", () => {

        it("should create a topic object with a title and description", (done) => {
            Topic.create({
                title: "The universe and you",
                description: "Little known facts about the universe we live in"
            })
            .then((topic) => {
                expect(topic.title).toBe("The universe and you");
                expect(topic.description).toBe("Little known facts about the universe we live in");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a topic with a missing title or description", (done) => {
            Topic.create({
                description: "This should not work"
            })
            .then((topic) => {
                //Nothing should happen here it should throw an error
            })
            .catch((err) => {
                expect(err.message).toContain("Topic.title cannot be null");
                done();
            });
        });

    });

    describe("#getPosts()", () => {

        it("should return the posts associated with the topic", (done) => {

            Topic.create({
                title: "The universe and you",
                description: "Little known facts about the universe we live in"
            })
            .then((topic) => {
                Post.create({
                    title: "Dark Matter",
                    body: "The universe is largely made up of a substance or substances known only to scientists as 'dark matter'",
                    topicId: topic.id,
                    userId: this.user.id
                })
                .then(() => {
                    Post.create({
                        title: "The Sun",
                        body: "Approximately 1,300,000 Earths can fit inside the sun",
                        topicId: topic.id,
                        userId: this.user.id
                    })
                    .then(() => {
                        topic.getPosts()
                        .then((posts) => {
                            expect(posts[0].title).toBe("Dark Matter");
                            expect(posts[1].title).toBe("The Sun");
                            done();
                        });
                    })
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            })

        });

        it("should return an empty array when no posts exist", (done) => {
            Topic.create({
                title: "The heat death of the universe",
                description: "Entropy is hell"
            })
            .then((topic) => {
                topic.getPosts()
                .then((posts) => {
                    expect(posts.length).toBe(0);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        });

    });

});
