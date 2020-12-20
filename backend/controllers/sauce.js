const Sauce = require('../models/Sauce'); //Notre SauceSchéma
const fs = require('fs'); //pour avoir accés aux différentes opérations liées au systeme de fichier

//Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; //l'id sera généré par Moongo
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée'})) //apres enregistrement on renvoie une reponse
        .catch(error => res.status(400).json({ error }));
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
    let sauceObject = 0
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlinkSync(`images/${filename}`)
            })
        sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
    } else {
        sauceObject = { ...req.body }
    }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifée' }))
    .catch(error => res.status(400).json({ error }));
    

}

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
    .catch(error => res.status(500).json({ error }));
}

//Liker ou disliker une sauce
exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        case 0:
            console.log(1);
            Sauce.findOne ({ _id: req.params.id })
                .then ((sauce) => {
                    console.log(2);
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        console.log(3);
                        Sauce.updateOne({
                            _id: req.params.id },
                            { $inc: { likes: -1}, $pull: { usersLiked: req.body.userId }, _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: 'like mis à jour' }))
                            .catch(error => res.status(400).json({ error }));
                    } if (sauce.usersDisliked.find( user => user === req.body.userId)) {
                        Sauce.updateOne({
                            _id: req.params.id },
                            { $inc: { dislikes: -1}, $pull: { usersDisliked: req.body.userId }, _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: 'dislike mis à jour' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
            .catch(error => res.status(400).json({ error }));
        break;
        case 1:
            Sauce.updateOne({
                _id: req.params.id },
                { $inc: { likes: 1}, $push: { usersLiked: req.body.userId }, _id: req.params.id
            })
                .then(() => res.status(201).json({ message: 'Like ajouté' }))
                .catch(error => res.status(400).json({ error }));
        break;
        case -1:
            Sauce.updateOne({
                _id: req.params.id },
                { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId }, _id: req.params.id
            })
                .then(() => res.status(201).json({ message: 'Dislike ajouté' }))
                .catch(error => res.status(400).json({ error }));
        break;
        default:
            console.error('error');          
    }
}

//Une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};