require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const { validateUserBody, validateAuthentification } = require('./middlewares/validations');
const { errorHandler } = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { MONGO_DB_URL, limiter } = require('./utils/config');

const { PORT = 3000, DB_URL = MONGO_DB_URL } = process.env;

const app = express();

app.use(cors({
  origin: 'https://rpmovies.nomoredomainswork.ru',
  credentials: true,
}));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(express.json());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(limiter);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateAuthentification, createUser);

app.post('/signin', validateUserBody, login);

app.use(auth);

app.use('/', require('./routes/users'));

app.use('/', require('./routes/movies'));

app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use((req, res, next) => next(new NotFoundError('Страницы по данному URL не существует')));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
