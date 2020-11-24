const express = require('express'); //on importe le framework express
const mongoose = require('mongoose'); //on importe mongoose
const bodyParser = require('body-parser'); //on importe body-parser pour transformer le corps en json
const path = require('path');
const helmet = require('helmet'); //sécurise les headers HTTP

const usersRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

require('dotenv').config();

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //on permet l'accés a notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //ajout des headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //permet l'envoi des requête
  next();
});

app.use(bodyParser.json());

mongoose.connect(process.env.DB_URI,
  { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(helmet());

app.use('/api/auth', usersRoutes); //pour la routes auth on utilise le router userRoutes
app.use('/api/sauces', saucesRoutes); //pour cette route on utilise le router saucesRoutes

module.exports = app; //exporter notre app