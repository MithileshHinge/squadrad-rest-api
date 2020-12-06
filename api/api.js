/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

/**
 * server configuration
 */
const config = require('../config/');
const mykeys = require('../config/mykeys');
const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');

// Import UserController for Passport
const UserController = require('./controllers/UserController');


// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');
const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// passport-google-oauth20 strategy -- http://www.passportjs.org/docs/google/ (See OAuth 2.0)
passport.use(new GoogleStrategy({
  clientID: mykeys.GOOGLE_CLIENT_ID,
  clientSecret: mykeys.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/redirect"
}, (accessToken, refreshToken, profile, done) => UserController().loginGoogle(accessToken, refreshToken, profile, done)));

app.get('/auth/google', passport.authenticate('google', {session: false, scope: 'openid profile email'}));
app.get('/auth/google/redirect',
  passport.authenticate('google', {session: false, failureRedirect: '/login'}), 
  (req, res) => UserController().loginGoogleCallback(req, res)
);


// secure your private routes with jwt authentication middleware
app.all('/private/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('/public', mappedOpenRoutes);
app.use('/private', mappedAuthRoutes);

server.listen(config.port, () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  return DB;
});
