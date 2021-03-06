const   request = require('request'),
        server = require('../../src/server'),
        base = 'http://localhost:3000/topics',
        sequelize = require('../../src/db/models/index').sequelize,
        Topic = require('../../src/db/models').Topic,
        Post = require('../../src/db/models').Post,
        User = require('../../src/db/models').User;

describe("route: posts", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        this.user;
        this.memberUser;
        this.memberPost;

        sequelize.sync({force: true}).then((res) => {

            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe",
                role: "admin"
            })
            .then((user) => {
                this.user = user;

                User.create({
                    email: "testuser@example.com",
                    password: "password",
                    role: "member"
                })
                .then((memberUser) => {
                    this.memberUser = memberUser;

                    Topic.create({
                        title: "Winter Games",
                        description: "Post your Winter Games stories",
                        posts: [{
                            title: "Snowball Fighting",
                            body: "So much snow!",
                            userId: this.user.id
                        },{
                            title: "Snowboarding",
                            body: "It's my favorite winter sport.",
                            userId: this.memberUser.id
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
                        this.memberPost = topic.posts[1];
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

        });
    });

    describe("guest user performing CRUD operations on post", () => {

        beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    userId: 0
                }
            }, (err, res, body) => {
                done();
            });
        });

        describe("GET /topics/:topicId/posts/new", () => {

            it("should not render a new post form and redirect to sign in", (done) => {
                request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Sign in");
                    done();
                });
            });

        });

        describe("POST /topics/:topicId/posts/create", () => {

            it("should not create a new post and redirect to sign in", (done) => {
                const options = {
                    url: `${base}/${this.topic.id}/posts/create`,
                    form: {
                        title: "Watching snow melt",
                        body: "Without a doubt my favoriting things to do besides watching paint dry!"
                    }
                };

                request.post(options, (err, res, body) => {
                    Post.findOne({where: {title: "Watching snow melt"}})
                    .then((post) => {
                        expect(post).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

        });

        describe("GET /topics/:topicId/posts/:id", () => {

            it("should render a view with the selected post", (done) => {
                request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Snowball Fighting");
                    done();
                });
            });

        });

        describe("POST /topics/:topicId/posts/:id/destroy", () => {

            it("should not delete the post with the associated id", (done) => {
                expect(this.post.id).toBe(1);
                const postCountBeforeDelete = this.topic.posts.length;
                request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
                    Post.findById(1)
                    .then((post) => {
                        expect(err).toBeNull();
                        expect(post).not.toBeNull();
                        expect(this.topic.posts.length).toBe(postCountBeforeDelete);
                        done();
                    });
                });
            });

        });

        describe("GET /topics/:topicId/posts/:id/edit", () => {

            it("should not render a view with an edit post form", (done) => {
                request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).not.toContain("Edit Post");
                    expect(body).toContain("Snowball Fighting");
                    done();
                });
            });

        });

        describe("POST /topics/:topicId/posts/:id/update", () => {

            it("should not return status code 302", (done) => {
                request.post({
                    url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
                    form: {
                        title: "Snowman Building Competition",
                        body: "I love watching the snow melt slowly."
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).not.toBe(302);
                    done();
                });
            });

            it("should not update the post with the given values", (done) => {
                const options = {
                    url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
                    form: {
                        title: "Snowman Building Competition",
                        body: "An ice cold competition."
                    }
                };

                request.post(options, (err, res, body) => {
                    expect(err).toBeNull();
                    Post.findOne({
                        where: {id: this.post.id}
                    })
                    .then((post) => {
                        expect(post.title).toBe("Snowball Fighting");
                        done();
                    });
                });
            });

        });

    });

    describe("signed in user performing CRUD operations on post", () => {

        beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                    role: this.memberUser.role,
                    userId: this.memberUser.id,
                    email: this.memberUser.email
                }
            }, (err, res, body) => {
                done();
            });
        });

        describe("GET /topics/:topicId/posts/new", () => {

            it("should render a new post form", (done) => {
                request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Post");
                    done();
                });
            });

        });

        describe("POST /topics/:topicId/posts/create", () => {

            it("should create a new post and redirect", (done) => {
                const options = {
                    url: `${base}/${this.topic.id}/posts/create`,
                    form: {
                        title: "Watching snow melt",
                        body: "Without a doubt my favoriting things to do besides watching paint dry!"
                    }
                };

                request.post(options, (err, res, body) => {
                    Post.findOne({where: {title: "Watching snow melt"}})
                    .then((post) => {
                        expect(post).not.toBeNull();
                        expect(post.title).toBe("Watching snow melt");
                        expect(post.body).toBe("Without a doubt my favoriting things to do besides watching paint dry!");
                        expect(post.topicId).not.toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

            it("should not create a new post that fails validations", (done) => {
                const options = {
                    url: `${base}/${this.topic.id}/posts/create`,
                    form: {
                        title: 'a',
                        body: 'b'
                    }
                };

                request.post(options, (err, res, body) => {
                    Post.findOne({where: {title: 'a'}})
                    .then((post) => {
                        expect(post).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });

        });

        describe("GET /topics/:topicId/posts/:id", () => {

            it("should render a view with the selected post", (done) => {
                request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Snowball Fighting");
                    done();
                });
            });

        });

        describe("POST /topics/:topicId/posts/:id/destroy", () => {

            it("should delete the post with the associated id", (done) => {
                request.post(`${base}/${this.topic.id}/posts/${this.memberPost.id}/destroy`, (err, res, body) => {
                    Post.findById(this.memberPost.id)
                    .then((post) => {
                        expect(err).toBeNull();
                        expect(post).toBeNull();
                        done();
                    });
                });
            });

        });

        describe("GET /topics/:topicId/posts/:id/edit", () => {

            it("should render a view with an edit post form", (done) => {
                request.get(`${base}/${this.topic.id}/posts/${this.memberPost.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit Post");
                    expect(body).toContain("Snowboarding");
                    done();
                });
            });

        });

        describe("POST /topics/:topicId/posts/:id/update", () => {

            it("should return the status code 302", (done) => {
                request.post({
                    url: `${base}/${this.topic.id}/posts/${this.memberPost.id}/update`,
                    form: {
                        title: "Snowman Building Competition",
                        body: "I love watching the snow melt slowly."
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(302);
                    done();
                });
            });

            it("should update the post with the given values", (done) => {
                const options = {
                    url: `${base}/${this.topic.id}/posts/${this.memberPost.id}/update`,
                    form: {
                        title: "Snowman Building Competition",
                        body: "An ice cold competition."
                    }
                };

                request.post(options, (err, res, body) => {
                    expect(err).toBeNull();
                    Post.findOne({
                        where: {id: this.memberPost.id}
                    })
                    .then((post) => {
                        expect(post.title).toBe("Snowman Building Competition");
                        done();
                    });
                });
            });

        });

    })

});
