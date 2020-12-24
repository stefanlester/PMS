let chai = require("chai")
let chaiHttp = require("chai-http")
const app = require("../app")
let server = require("../server")

//Assertion Style
chai.should()

chai.use(chaiHttp)

describe('Passwords API', () => {

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
    })
})