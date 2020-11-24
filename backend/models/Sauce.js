const mongoose = require('mongoose');

//création du schéma sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, //id
    name: { type: String, required: true }, //nom de la sauce
    manufacturer: { type: String, required: true }, //fabricant
    description: { type: String, required: true }, //description
    mainPepper: { type: String, required: true }, //ingrédient principal
    imageUrl: { type: String, required: true }, //image de la sauce téléchargée
    heat: { type: Number, required: true }, //note de la sauce entre 1 et 10
    likes: { type: Number, default: 0 }, //nombre users aimants la sauce
    dislikes: { type: Number, default: 0 }, //nombre users n'aimants pas la sauce
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

module.exports = mongoose.model('Sauce', sauceSchema);