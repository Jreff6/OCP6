const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');



app.use(express.json());  

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/stuff', bookRoutes);
  app.use('/api/auth', userRoutes);

  module.exports= app;