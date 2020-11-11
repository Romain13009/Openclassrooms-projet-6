const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//création du schéma utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //un email doit être unique
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
//Ce modèle nous permet de ne pas avoir plusieurs utilisateurs avec a même adresse mail

module.exports = mongoose.model('User', userSchema);