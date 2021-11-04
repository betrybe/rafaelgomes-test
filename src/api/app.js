const express = require('express');
const path = require('path');

const app = express();

// Config JSON response
app.use(express.json());

// Public folder for images
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
const UserRoutes = require('../routes/UserRoutes');
const LoginRoutes = require('../routes/LoginRoutes');
const RecipeRoutes = require('../routes/RecipeRoutes');
const ImageRoutes = require('../routes/ImageRoutes');

app.use('/users', UserRoutes);
app.use('/login', LoginRoutes);
app.use('/recipes', RecipeRoutes);
app.use('/images', ImageRoutes);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
