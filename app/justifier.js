module.exports = {
    separerParagraphes,
    separerMots,
    justifierParagraphes
}

/**
 * Sépare un texte brut en différents paragraphes (en considérant que 2 retours lignes séparent 2 paragraphes)
 * @param {string} texte Le texte à traiter
 * @return {string[]} Tableau dont les éléments sont les différents paragraphes
 */
function separerParagraphes(texte) {
    return texte
        .trim()
        .split(/(?:\r\n *){2,}|(?:\r *){2,}|(?:\n *){2,}/)
        .filter((el) => el)
}

/**
 * Sépare un texte brut en différents mots (chaque mot étant séparé par un ou plusieurs espaces ou des retours lignes)
 * @param {string} texte Le texte à traiter
 * @return {string[]} Tableau dont les éléments sont les mots du texte
 */
function separerMots(texte) {
    return texte.trim().replace(/[\r\n]+/g, '').split(/ +/)
}

/**
 * Justifie une suite de mots en fonction de la longueur donnée en rajoutant les espaces nécessaires entre les mots
 * @param {string[]} ligne La suite de mots à traiter
 * @param {number} longueur La longueur souhaitée
 * @return {string} La ligne justifiée
 */
function justifierLigne (ligne, longueur) {
    const nbCar = ligne.reduce((longueur, mot) => longueur + mot.length, 0)
    let nbCarEspacesTot = longueur - nbCar
    return ligne
        .map((mot, index) => {
            const nbSeparations = ligne.length - index - 1
            const rapport = nbCarEspacesTot / nbSeparations
            const nbCarEspacesSeparation = (index % 2 ? Math.ceil(rapport) : Math.floor(rapport)) | 0
            nbCarEspacesTot -= nbCarEspacesSeparation
            return mot.padEnd(mot.length + nbCarEspacesSeparation)
        })
        .join('')
}

/**
 * Justifie successivement plusieurs suites de mots
 * @param {string[][]} lignes Les différentes suites de mots
 * @param {number} longueur La longueur souhaitée
 * @return {string[]} Les lignes justifiées
 */
function justifierLignes (lignes, longueur) {
    const nbLignes = lignes.length
    return lignes.map((ligne, index) => nbLignes === index + 1
        ? ligne.join(' ')
        : justifierLigne(ligne, longueur))
}

/**
 * Justifie un paragraphe selon la longueur de ligne souhaitée
 * @param {string} paragraphe Le paragraphe à traiter
 * @param {number} longueur La longueur souhaitée
 * @return {string} Les lignes justifiées
 */
function justifierParagraphe (paragraphe, longueur) {
    const mots = separerMots(paragraphe)
    //Constitution des différentes lignes du paragraphe
    let ligne = []
    let longueurLigne = 0
    let lignesParagraphe = []
    for (let mot of mots) {
        const longueurMot = mot.length
        if (longueurLigne + longueurMot > longueur) {
            lignesParagraphe.push(ligne)
            ligne = []
            longueurLigne = 0
        }
        ligne.push(mot)
        longueurLigne += longueurMot + 1
    }
    lignesParagraphe.push(ligne)
    //Parcours du paragraphe en sens inverse pour "lisser" le nombre de mots par ligne et éviter d'avoir trop d'espaces sur l'avant-dernière ligne
    for (let i = lignesParagraphe.length - 2; i > 1; i--) {
        const ligneCourante = lignesParagraphe[i]
        const lignePrec = lignesParagraphe[i - 1]
        const longueurLigneCourante = ligneCourante.length + ligneCourante.reduce((longueur, mot) => longueur + mot.length, 0)
        const longueurMotPrec = lignePrec[lignePrec.length - 1].length
        if (longueurMotPrec + longueurLigneCourante < 80) {
            ligneCourante.unshift(lignePrec.pop())
        }
    }
    //Concaténation des lignes
    return justifierLignes(lignesParagraphe, longueur).join('\n')
}

/**
 * Justifie et concatène des paragraphes
 * @param {string[]} paragraphes Les paragraphes à traiter
 * @param {number} longueur La longueur souhaitée
 * @return {string} Un texte justifié
 */
function justifierParagraphes (paragraphes, longueur) {
    return paragraphes
        .map((paragraphe) => justifierParagraphe(paragraphe, longueur))
        .join('\n')
}