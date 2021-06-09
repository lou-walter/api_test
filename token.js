const jwt = require('jsonwebtoken')
const NodeCache = require('node-cache')
const justifier = require('./justifier')

//Instanciation du cache pour le limit rate
const cache = new NodeCache()

const SECRET = 'secret pas très secret'
const LIMIT_RATE = 80000
const TTL = 3600 * 24

module.exports = {
    genererToken,
    authentifierToken,
    limiterUtilisationToken,
}

/**
 * Génère un token en fonction d'un email signé par un secret de token
 * @param {string} email L'email
 * @return {string} Le token
 */
function genererToken (email) {
    return jwt.sign(email, SECRET)
}

/**
 * Middleware qui vérifie la validité d'un token
 */
function authentifierToken (req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send('Token manquant')

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).send('Mauvais token')
        req.user = user
        next()
    })
}

/**
 * Middleware qui limite l'utilisation d'un token à un traitement de 80000 mots par jour pour le point d'appel /justifier
 */
function limiterUtilisationToken (req, res, next) {
    const user = req.user
    try {
        const tailleTexte = justifier.separerMots(req.body).length
        const nbMots = cache.get(user)
        if (nbMots === undefined && tailleTexte < LIMIT_RATE) {
            cache.set(user, tailleTexte, TTL)
        } else if (nbMots + tailleTexte < LIMIT_RATE) {
            cache.set(user, tailleTexte + nbMots, (cache.getTtl(user) - Date.now()) / 1000 | 0)
        } else {
            res.status(402).send('Payment required')
        }
    } catch (err) {
        res.status(500).send(err)
    }
    next()
}