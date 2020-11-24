const multer = require('multer'); //on importe multer après l'avoir installé

const MIME_TYPES = { //notre dictionnaire
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

//on va créer un objet de configuration pour multer, la fonction diskstorage indique qu'on va enregister sur le disque
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') //la destination
    },
    filename: (req, file, callback) => {//ici on va générer un nouveau nom pour le fichier qui arrive
        const name = file.originalname.split(' ').join('_'); //ne nom avant l'extension = nom d'origine auquel on supprime les espaces potentiels qu'on remplace par des _
        const extension = MIME_TYPES[file.mimetype]; //élément de notre dictio qui correspond au mimetype du fichier envoyé par le frontend
        callback(null, name + Date.now() + '.' + extension); //on génère le nouveau nom, on y ajoute un date.now pour le rendre le plus unique possible
    } 
});

module.exports = multer({ storage }).single('image');

