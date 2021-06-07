/**
 * third party libraries
 */
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const YoutubeStrategy = require('passport-youtube-v3').Strategy;

/**
 * server configuration
 */
const config = require('../config/');
const myKeys = require('../config/mykeys');
const dbService = require('./services/db.service');
const fupService = require('./services/fileupload.service');
const auth = require('./policies/auth.policy');

// Import UserController for Passport and Multer (fupServive)
const UserController = require('./controllers/UserController');
const CreatorController = require('./controllers/CreatorController');

// Get Razorpay instance to attach to /payments requests below
const rzpService = require('./services/rzp.service');

const rzpInstance = rzpService.getInstance(myKeys.RZP_TEST_ID, myKeys.RZP_TEST_SECRET);

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
const privateRoutePrefix = '/private';
const publicRoutePrefix = '/public';

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// for parsing jwt from cookie
app.use(cookieParser());

// secure express app
app.use(helmet({
	dnsPrefetchControl: false,
	frameguard: false,
	ieNoOpen: false,
}));

// parsing the request bodys
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// passport-google-oauth20 strategy -- http://www.passportjs.org/docs/google/ (See OAuth 2.0)
passport.use(new GoogleStrategy({
	clientID: myKeys.GOOGLE_CLIENT_ID,
	clientSecret: myKeys.GOOGLE_CLIENT_SECRET,
	callbackURL: '/auth/google/redirect',
}, (accessToken, refreshToken, profile, done) => UserController().loginGoogle(accessToken, refreshToken, profile, done)));

app.get('/auth/google', passport.authenticate('google', { session: false, scope: 'openid profile email' }));
app.get(
	'/auth/google/redirect',
	passport.authenticate('google', { session: false, failureRedirect: '/login' }),
	(req, res) => UserController().loginGoogleCallback(req, res),
);

// passport-youtube-v3 strategy -- https://github.com/yanatan16/passport-youtube-v3#readme
passport.use(new YoutubeStrategy({
	clientID: myKeys.GOOGLE_CLIENT_ID,
	clientSecret: myKeys.GOOGLE_CLIENT_SECRET,
	callbackURL: '/auth/youtube/redirect',
	scope: ['https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly'],
	authorizationParams: {
		accessType: 'offline',
	},
}, (accessToken, refreshToken, profile, done) => UserController().loginYoutube(accessToken, refreshToken, profile, done)));

app.get('/auth/youtube', passport.authenticate('youtube', { session: false }));
app.get(
	'/auth/youtube/redirect',
	passport.authenticate('youtube', { session: false, failureRedirect: '/login' }),
	(req, res) => UserController().loginYoutubeCallback(req, res),
);

// secure private routes with jwt authentication middleware
app.all(`${privateRoutePrefix}/*`, (req, res, next) => auth(req, res, next));

// check if user is creator before posting to creator api (crud operations on /creator are safe without this check, methods other than post (if restricted) should be checked in the function, so only POST /creator/* is required)
app.post(`${privateRoutePrefix}/creator/*`, (req, res, next) => CreatorController().allowIfCreator(req, res, next));

// File upload routes
app.post(`${privateRoutePrefix}/user/profile-pic`, fupService.uploadProfilePic, UserController().updateProfilePic);
app.post(`${privateRoutePrefix}/creator/profile-pic`, fupService.uploadCreatorProfilePic, CreatorController().updateProfilePic);
app.post(`${privateRoutePrefix}/creator/cover-pic`, fupService.uploadCreatorCoverPic, CreatorController().updateCoverPic);
app.post(`${privateRoutePrefix}/creator/post`, fupService.uploadPost);

// Attach Razorpay instance to all /payments routes
app.all(`${privateRoutePrefix}/payments`, (req, res, next) => {
	if (rzpInstance) {
		req.rzpInstance = rzpInstance;
		return next();
	}
	return res.status(500).json({ msg: 'Internal Server Error: Razorpay not instantiated' });
});

// fill routes for express application
app.use(publicRoutePrefix, mappedOpenRoutes);
app.use(privateRoutePrefix, mappedAuthRoutes);

app.use((req, res) => {
	res.status(404).send('Sorry, can\'t find that');
});

// default route - logging only

app.all('*', (req, res) => {
	console.log(req.originalUrl);
	res.status(404).json({ msg: 'Error: Route not found' });
});

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
