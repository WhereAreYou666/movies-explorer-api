const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const InputError = require('../errors/InputError');
const AuthNotFoundError = require('../errors/AuthNotFoundError');

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const userId = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InputError('переданы некорректные данные в методы создания карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Movie.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с указанным id не существует'))
    .then((card) => {
      if (userId !== card.owner._id.toString()) {
        throw new AuthNotFoundError('карточка не принадлежит пользователю');
      } else {
        Movie.findByIdAndRemove(cardId)
          .orFail(() => new NotFoundError('Карточка с указанным id не существует'))
          .then((cardCurrentUser) => {
            res.send(cardCurrentUser);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new InputError('Карточка с указанным id не найдена.'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};
