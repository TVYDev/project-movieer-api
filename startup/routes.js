const express = require('express');
const expressFileUpload = require('express-fileupload');
const errorHandler = require('../middlewares/errorHandler');
const jsonResponse = require('../middlewares/jsonResponse');
const cinemas = require('../routes/cinemas');
const halls = require('../routes/halls');
const hallTypes = require('../routes/hallTypes');
const movieTypes = require('../routes/movieTypes');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const languages = require('../routes/languages');
const countries = require('../routes/countries');
const showtimes = require('../routes/showtimes');
const settings = require('../routes/settings');
const announcements = require('../routes/announcements');
const memberships = require('../routes/memberships');
const users = require('../routes/users');
const purchases = require('../routes/purchases');
const auth = require('../routes/auth');

module.exports = function (app) {
  app.use(express.json());
  app.use(jsonResponse);
  app.use(expressFileUpload());
  app.use('/api/v1/cinemas', cinemas);
  app.use('/api/v1/halls', halls);
  app.use('/api/v1/hall-types', hallTypes);
  app.use('/api/v1/movie-types', movieTypes);
  app.use('/api/v1/genres', genres);
  app.use('/api/v1/movies', movies);
  app.use('/api/v1/languages', languages);
  app.use('/api/v1/countries', countries);
  app.use('/api/v1/showtimes', showtimes);
  app.use('/api/v1/settings', settings);
  app.use('/api/v1/announcements', announcements);
  app.use('/api/v1/memberships', memberships);
  app.use('/api/v1/users', users);
  app.use('/api/v1/purchases', purchases);
  app.use('/api/v1/auth', auth);
  app.use(errorHandler);
};
