const router = require('express').Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const {
  validateRouterPostMovies,
  validateRouterDeleteMovies,
} = require('../middlewares/validations');

router.get('/movies', getMovies);

router.post('/movies', validateRouterPostMovies, createMovie);

router.delete('/movies/:cardId', validateRouterDeleteMovies, deleteMovie);

module.exports = router;
