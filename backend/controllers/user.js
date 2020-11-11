const bcrypt = require('bcrypt'); //Notre système de cryptage
const User = require('../models/User'); //Notre UserSchéma


//Pour la création de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //hashage du mdp, 10 répète l'algorythme de hashage
        .then(hash => { //On récupère le hash du password et créer un nouvel utilisateur
            const user = new User({
                email: req.body.email, //on récupère l'email dans le corps de la requête
                password: hash //on récupère le mdp crypté
            });
            user.save() //cette méthode enregistre dans la bde
                .then(() => res.status(201).json({ message: 'Utilisateur créé.'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


//Pour l'authentification d'utilisateurs existants
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //On veut que l'email correspond a l'email envoyé dans la requête
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur inconnu' }); //si la fonction ne trouve pas d'utilisateur
            }
            bcrypt.compare(req.body.password, user.password) //On utilise bcrypt.compare pour comparer le mdp envoyé dans le corps de la requête avec le hash enregistrer dans notre doc user
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect' });
                    }
                    res.status(200).json({ //si le mdp correspond on retourne un objet json
                        userId: user._id,
                        token: 'TOKEN'
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};