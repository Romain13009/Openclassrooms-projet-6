const express = require('express'); //on importe le framework express
const mongoose = require('mongoose'); //on importe mongoose
const bodyParser = require('body-parser'); //on importe body-parser pour transformer le corps en json

const usersRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //on permet l'accés a notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //ajout des headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //permet l'envoi des requête
  next();
});

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Roro13009:123Test321@projet6.dp0yo.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use('/api/auth', usersRoutes); //pour la routes auth on utilise le router userRoutes
app.use('/api/sauces', saucesRoutes); //pour cette route on utilise le router saucesRoutes

module.exports = app; //exporter notre app