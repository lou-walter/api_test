const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')

chai.should()
chai.use(chaiHttp)

const mauvaisBody = {"nom":"lw@laposte.net"}
const body = {"email":"lw@laposte.net"}
const token = "eyJhbGciOiJIUzI1NiJ9.bHdAbGFwb3N0ZS5uZXQ.1XZRvUTbLj3oaxJIeKjfWkuxn5bne7AUU_BOLigax-s"

describe('Test route POST /token', () => {
    it("Retourne un token unique", (done) => {
        chai.request(app)
            .post('/token')
            .type('application/json')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.eq(token)
                done()
            })
    })
    it("Retourne une erreur 400", (done) => {
        chai.request(app)
            .post('/token')
            .type('text/plain')
            .end((err, res) => {
                res.should.have.status(400)
                res.text.should.be.eq('Le body doit être au format application/json')
                done()
            })
    })
    it("Retourne une erreur 403", (done) => {
        chai.request(app)
            .post('/token')
            .type('application/json')
            .send(mauvaisBody)
            .end((err, res) => {
                res.should.have.status(403)
                res.text.should.be.eq('Champ email manquant')
                done()
            })
    })
})

