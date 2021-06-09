const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const token = require('../app/token')

chai.should()
chai.use(chaiHttp)

const user = 'lw@laposte.net'
const tokenValide = 'eyJhbGciOiJIUzI1NiJ9.bHdAbGFwb3N0ZS5uZXQ.1XZRvUTbLj3oaxJIeKjfWkuxn5bne7AUU_BOLigax-s'
const texte = 'Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de charles-quint.\n' +
    '\n' +
    'Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. \n' +
    ' Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais quelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant les distances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans son souvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour.\n' +
    ' '
const texteJustifie = 'Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,\n' +
    'mes yeux  se fermaient  si vite  que je  n’avais pas  le temps  de me  dire: «Je\n' +
    'm’endors.» Et,  une demi-heure  après, la  pensée qu’il  était temps de chercher\n' +
    'le sommeil  m’éveillait; je  voulais poser  le volume  que je croyais avoir dans\n' +
    'les mains  et souffler  ma lumière;  je n’avais  pas cessé  en dormant  de faire\n' +
    'des réflexions  sur ce  que je  venais de lire, mais ces réflexions avaient pris\n' +
    'un tour  un peu  particulier; il  me  semblait  que  j’étais  moi-même  ce  dont\n' +
    'parlait l’ouvrage:  une église,  un quatuor,  la rivalité  de François Ier et de\n' +
    'charles-quint.\n' +
    'Cette croyance  survivait pendant  quelques  secondes  à  mon  réveil;  elle  ne\n' +
    'choquait pas  ma raison,  mais pesait  comme des  écailles sur  mes yeux  et les\n' +
    'empêchait de  se rendre  compte que  le bougeoir  n’était plus allumé. Puis elle\n' +
    'commençait à  me devenir inintelligible, comme après la métempsycose les pensées\n' +
    'd’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre\n' +
    'de m’y  appliquer ou  non; aussitôt  je recouvrais la vue et j’étais bien étonné\n' +
    'de trouver  autour de  moi une obscurité, douce et reposante pour mes yeux, mais\n' +
    'peut-être plus  encore pour  mon esprit, à qui elle apparaissait comme une chose\n' +
    'sans cause,  incompréhensible, comme une chose vraiment obscure. Je me demandais\n' +
    'quelle heure  il pouvait  être; j’entendais  le sifflement  des trains qui, plus\n' +
    'ou moins  éloigné, comme  le chant  d’un oiseau  dans une  forêt,  relevant  les\n' +
    'distances, me  décrivait l’étendue de la campagne déserte où le voyageur se hâte\n' +
    'vers la  station prochaine;  et le  petit chemin  qu’il suit  va être gravé dans\n' +
    'son souvenir  par l’excitation  qu’il doit  à des  lieux nouveaux,  à des  actes\n' +
    'inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le\n' +
    'suivent encore dans le silence de la nuit, à la douceur prochaine du retour.'

describe('Test route POST /justifier', () => {
    it("Retourne le texte justifié", (done) =>{
        chai.request(app)
            .post('/justifier')
            .set({ "Authorization": `Bearer ${tokenValide}`})
            .type('text/plain')
            .send(texte)
            .end((err, res) => {
                res.should.have.status(200)
                res.text.should.be.eq(texteJustifie)
                done()
            })
    })
    it("Retourne erreur 400", (done) =>{
        chai.request(app)
            .post('/justifier')
            .set({ "Authorization": `Bearer ${tokenValide}`})
            .type('text/html')
            .end((err, res) => {
                res.should.have.status(400)
                res.text.should.be.eq('Le body doit être au format text/plain')
                done()
            })
    })
    it("Retourne erreur 401", (done) =>{
        chai.request(app)
            .post('/justifier')
            .type('text/plain')
            .end((err, res) => {
                res.should.have.status(401)
                res.text.should.be.eq('Token manquant')
                done()
            })
    })
    it("Retourne erreur 403", (done) =>{
        chai.request(app)
            .post('/justifier')
            .set({ "Authorization": `Bearer mauvais_token`})
            .type('text/plain')
            .end((err, res) => {
                res.should.have.status(403)
                res.text.should.be.eq('Mauvais token')
                done()
            })
    })
    it("Retourne erreur 402", (done) =>{
        token.cache.set(user, 79900)
        chai.request(app)
            .post('/justifier')
            .set({ "Authorization": `Bearer ${tokenValide}`})
            .type('text/plain')
            .send(texte)
            .end((err, res) => {
                res.should.have.status(402)
                res.text.should.be.eq('Payment required')
                done()
            })
    })
})
