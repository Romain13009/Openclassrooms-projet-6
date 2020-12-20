const bcrypt = require('bcrypt'); //Notre système de cryptage
const jwt = require('jsonwebtoken'); //permet de créer et de vérifier des tokens d'auth
const User = require('../models/User'); //Notre UserSchéma


//Pour la création de nouveaux utilisateurs
//expression régulière: 8 caractères, une maj, une min, un chiffre
var regexPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/;
var regexEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z{2,8})(\.[a-z]{2,8})?$/;

exports.signup = (req, res, next) => {
    if(((req.body.password).match(regexPassword))&&(req.body.email).match(regexEmail)) {
      bcrypt.hash(req.body.password, 10) //hashage du mdp, 10 répète l'algorythme de hashage
        .then(hash => { //On récupère le hash du password et créer un nouvel utilisateur
            const user = new User({
                email: req.body.email, //on récupère l'email dans le corps de la requête
                password: hash //on récupère le mdp crypté
            });
            user.save() //cette méthode enregistre dans la bdd
                .then(() => res.status(201).json({ message: 'Utilisateur créé.'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));  
    } else {
        return res.status(401).json({ error: 'Votre mot de passe doit faire au moins 8 caractères et doit contenir au moins une majuscule, une minuscule et un nombre'});
    }
};


//Pour l'authentification d'utilisateurs existants
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //On veut que l'email correspond a l'email envoyé dans la requête
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Adresse mail ou Mot de passe incorrect' }); //si la fonction ne trouve pas d'utilisateur
            }
            bcrypt.compare(req.body.password, user.password) //On utilise bcrypt.compare pour comparer le mdp envoyé dans le corps de la requête avec le hash enregistrer dans notre doc user
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Adresse mail ou Mot de passe incorrect' });
                    }
                    res.status(200).json({ //si le mdp correspond on retourne un objet json
                        userId: user._id,
                        token: jwt.sign( //fonction sign pour encoder
                            { userId: user._id }, //1er argument: ce qque l'on veut encoder
                            'RANDOM_TOKEN_SECRET', //2ème argument: clé secrète
                            { expiresIn: '8h' } //3ème argument: argument de configuration
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};