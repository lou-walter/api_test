const express = require('express')
const bodyParser = require('body-parser')
const justifier = require('./justifier')
const token = require('./token')

const PORT = 8080

const app = express()
app.use(bodyParser.json())
app.use(express.text())

app.post('/token',
    (req, res, next) => {
        if (! req.is('application/json')) return res.status(400).send('Le body doit être au format application/json')
        if (req.body.email === undefined) return res.status(403).send('Champ email manquant')
        next()
    },
    (req, res) => {
        res.json(token.genererToken(req.body.email))
    }
)

app.post(
    '/justifier',
    (req, res, next) => {
        if (! req.is('text/plain')) {
            return res.status(400).send('Le body doit être au format text/plain')
        }
        next()
    },
    token.authentifierToken,
    token.limiterUtilisationToken,
    (req, res) => {
        try {
            return res.send(justifier.justifierParagraphes(justifier.separerParagraphes(req.body), 80))
        } catch(err) {
            return res.status(500).send(err)
        }
    }
)

module.exports = app.listen(process.env.PORT || PORT, () =>
    console.log(`App en écoute sur le port ${PORT}!`)
)