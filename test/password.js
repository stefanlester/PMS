let chai = require("chai")
let chaiHttp = require("chai-http")
const app = require("../app") 
let server = require("../server")
const pms = require("../api/controllers/passwords")

//Assertion Style
chai.should()

chai.use(chaiHttp)

describe('Passwords API', () => {
    // test case for getting all passwords
    describe("http://localhost:4000/passwords/", () => {
        it("It should get all passwords", (done) => {
            chai.request(app)
                .get("/passwords")
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.an('object')
                    // response.body.length.should.be.eq(5)
                    done()

                })
        })

        // test case to make sure user can't vist any route(url) apart from defined routes(urls)
        it("It should not get all passwords", (done) => {
            chai.request(app)
                .get("/password")
                .end((err, response) => {
                    response.should.have.status(404)
                    done()

                })
        })


    })

    // test case for GET password (by id) route
    describe("http://localhost:4000/passwords/:id", () => {
        it("It should get a password by ID", (done) => {
            // sample ID  const pwId = "5fd3725e192b7528e8e604f5"
            //    const pmsID = _id
            chai.request(app)

                .get("/passwords/5fd89ac99e7ebc1d0c7b74a0")
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.an('object')
                    //response.body.should.have.property('_id:')
                    // response.body.length.should.be.eq(5)
                    done()

                })
        })

        //test case to make sure user can't get passwords not in database
        it("It should not get a password by ID", (done) => {
            // sample ID  const pwId = "5fd3725e192b7528e8e604f5"
            //    const pmsID = _id
            chai.request(app)

                // wrong password Id 123456789
                .get("/passwords/123456789")
                .end((err, response) => {
                    response.should.have.status(500)
                    response.body.should.be.an('object')
                    //response.body.should.have.property('_id:')
                    // response.body.length.should.be.eq(5)
                    done()

                })
        })


    })


    // test case generating passwords and creation and storage of Password
    // HIBP is also tested in this case as it is contained in the password.js contoller
    describe("http://localhost:4000/passwords", () => {
        it("It should CREATE/POST a new password with its legacy app", (done) => {
            const password = {
                title: "for testing",
                email_username: "testing34@testing.com",
                legacyApplicationUrl: "testing.com"
                //generatePassword is automated
            }
            chai.request(app)

                .post("/passwords") //hibp service runs from here
                .send(password)
                .end((err, response) => {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    //response.body.should.have.property('_id:')
                    // response.body.length.should.be.eq(5)
                    done()


                    //Once the email_username goes into database, the test will fail if you run it again 
                })
        })

        it("It should not CREATE/POST a new password with its legacy app if a required password schema is not defined", (done) => {
            const password = {
                title: "for testing",
                // no email_password is defined
                //generatePassword is automated
            }
            chai.request(app)

                .post("/passwords") //hibp service runs from here
                .send(password)
                .end((err, response) => {
                    response.should.have.status(500)
                    response.body.should.be.an('object')
                    //response.body.should.have.property('_id:')
                    // response.body.length.should.be.eq(5)
                    done()

                })
        })


        // test case for UPDATE/PATCH password (by id) route
        describe("http://localhost:4000/passwords/:id", () => {
            it("It should UPDATE an existing password by ID", (done) => {
                const password = [{
                    "propName": "title",
                    "value": "we move3"
                }]
                chai.request(app)

                    .patch("/passwords/5fd89ac99e7ebc1d0c7b74a0")
                    .send(password)
                    .end((err, response) => {
                        response.should.have.status(200)
                        response.body.should.be.an('object')
                        //response.body.should.have.property('_id:')
                        // response.body.length.should.be.eq(5)
                        done()
                        console.log("password updated")

                    })
            })

            it("It should NOT UPDATE an exisiting password by ID", (done) => {
                const password = [
                    //wrong parameters for update route
                    {
                        "passName": "cool",
                        "value": "we move4"
                    }
                ]
                chai.request(app)

                    .patch("/passwords/5fd89ac99e7ebc1d0c7b74a0")
                    .send(password)
                    .end((err, response) => {
                        response.should.have.status(200)
                        response.body.should.be.an('object')
                        //response.body.should.have.property('_id:')
                        // response.body.length.should.be.eq(5)
                        done()
                        console.log("password not updated, wrong parameters")

                    })
            })




        })

        // test case to delete a password
        describe("http://localhost:4000/passwords/:id", () => {
            it("It should DELETE a password by ID", (done) => {
                // sample ID  const pwId = "5fe4ce926a14a008ece4697f"
                //    const pmsID = _id
                chai.request(app)

                    .delete("/passwords/5fe4ce926a14a008ece4697f")
                    .end((err, response) => {
                        response.should.have.status(200)
                        response.body.should.be.an('object')
                        //response.body.should.have.property('_id:')
                        // response.body.length.should.be.eq(5)
                        done()

                        console.log("Password deleted")

                    })
            })

            //test case to make sure user can't delete password not in db
            it("It should not DELETE a password by ID", (done) => {
                // sample ID  const pwId = "5fd3725e192b7528e8e604f5"
                //    const pmsID = _id
                chai.request(app)

                    // wrong password Id 123456789
                    .get("/passwords/123456789")
                    .end((err, response) => {
                        response.should.have.status(500)
                        response.body.should.be.an('object')
                        //response.body.should.have.property('_id:')
                        // response.body.length.should.be.eq(5)
                        done()

                    })
            })


        })



    })
})