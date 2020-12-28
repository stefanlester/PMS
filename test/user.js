let chai = require("chai")
let chaiHttp = require("chai-http")
const app = require("../app")
let server = require("../server")
const pms = require("../api/controllers/passwords")
const user = require("../api/models/user")

//Assertion Style
chai.should()

chai.use(chaiHttp)

describe('Users API', () => {

    // test case for user sign up
    describe("http://localhost:4000/users", () => {
        it("It should CREATE/POST a account with a username(email) and password", (done) => {
            const user = {
                email: "stefanamoah2@test.com",
                password: "sajdod'skdksda" // password is hashed with bycrypt
            }
            chai.request(app)

                .post("/user/signup")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201)
                    response.body.should.be.an('object')
                    //response.body.should.have.property('_id:')
                    // response.body.length.should.be.eq(5)
                    done()


                    //Once the email goes into database, the test will fail if you run it again because mail exists in database
                })
        })

        it("It should not CREATE/POST a new account if the required parameters for user creation are not given", (done) => {
            const user = {
                email: "testing12@test.com"
                // no password is given
            }
            chai.request(app)

                .post("/user/signup") 
                .send(user)
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