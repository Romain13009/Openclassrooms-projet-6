const Sauce = require('../models/Sauce'); //Notre SauceSchéma
const fs = require('fs');

//Création d'une sauce
exports.createSauce = (req, res, next) => {
    console.log(1)
    const sauceObject = JSON.stringify(req.body.thing);
    console.log(2)
    //delete sauceObject._id; //l'id sera généré par Moongo
    console.log(3)
    const sauce = new Sauce({
        ...sauceObject,
    });
    console.log(4)
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée'})) //apres enregistrement on renvoie une reponse
        .catch(error => res.status(400).json({ error }));
    console.log(5)
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifée' }))
        .catch(error => res.status(400).json({ error }));
}

//Supprimer un sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
        .catch(error => res.status(400).json({ error }));
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