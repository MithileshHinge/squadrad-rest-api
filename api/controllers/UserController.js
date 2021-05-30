const moment = require('moment');
const axios = require('axios');
const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const defaultProfilePolicy = require('../policies/defaultProfile.policy');

const allowedFields = ['name', 'deactivated'];

const UserController = () => {
	const register = async (req, res) => {
		const { body } = req;
		// console.log(body);

		if (body.password === body.password2) {
			try {
				const user = await User.create({
					email: body.email,
					password: body.password,
					name: body.name,
					profile_pic: defaultProfilePolicy.getDefaultProfilePic(),
					registered_ip: req.ip,
					last_login_timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
				});
				const token = authService().issue({ id: user.user_id });

				return res.status(200).json({ token, user });
			} catch (err) {
				console.log(err);
				return res.status(500).json({ msg: 'Internal server error' });
			}
		}

		return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
	};

	const login = async (req, res) => {
		const { email, password } = req.body;
		// console.log(req.body);

		if (email && password) {
			try {
				const user = await User
					.findOne({
						where: {
							email,
						},
					});

				if (!user) {
					return res.status(400).json({ msg: 'Bad Request: User not found' });
				}

				if (bcryptService().comparePassword(password, user.password)) {
					const token = authService().issue({ id: user.user_id });
					user.last_login_timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
					user.save();
					return res.status(200).json({ token, user });
				}

				return res.status(401).json({ msg: 'Unauthorized' });
			} catch (err) {
				console.log(err);
				return res.status(500).json({ msg: 'Internal server error' });
			}
		}

		return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
	};

	// Google auth - see api.js
	// Auto sign up if user doesn't exist
	const loginGoogle = async (accessToken, refreshToken, profile, done) => {
		// console.log("GOOGLE_LOGIN : " + JSON.stringify(profile));
		/* SAMPLE profile
		{
			"id":"115799646981609673476",
			"displayName":"Mithilesh Hinge",
			"name":
				{
					"familyName":"Hinge",
					"givenName":"Mithilesh"
				},
			"emails":[{"value":"mithhinge@gmail.com","verified":true}],
			"photos":[{"value":"https://lh3.googleusercontent.com/a-/AOh14GhsHWJdRE08h6iEAyq5hBhMhTFTzctBmGJ1ASyR6A=s96-c" <-- Could be google assigned default picture}],
			"provider":"google",
			"_raw":"{\n  \"sub\": \"115799646981609673476\",\n  \"name\": \"Mithilesh Hinge\",\n  \"given_name\": \"Mithilesh\",\n  \"family_name\": \"Hinge\",\n  \"picture\": \"https://lh3.googleusercontent.com/a-/AOh14GhsHWJdRE08h6iEAyq5hBhMhTFTzctBmGJ1ASyR6A\\u003ds96-c\",\n  \"email\": \"mithhinge@gmail.com\",\n  \"email_verified\": true,\n  \"locale\": \"en\"\n}","_json":{"sub":"115799646981609673476","name":"Mithilesh Hinge","given_name":"Mithilesh","family_name":"Hinge","picture":"https://lh3.googleusercontent.com/a-/AOh14GhsHWJdRE08h6iEAyq5hBhMhTFTzctBmGJ1ASyR6A=s96-c","email":"mithhinge@gmail.com","email_verified":true,"locale":"en"}}
		*/
		try {
			// Check if profile pic is default
			let profilePic = profile.photos[0].value;
			if (profilePic.endsWith('photo.jpg')) {
				profilePic = defaultProfilePolicy.getDefaultProfilePic();
			}
			// eslint-disable-next-line no-unused-vars
			const [user, created] = await User.findOrCreate({
				where: { email: profile.emails[0].value },
				defaults: {
					password: accessToken,
					name: profile.displayName,
					profile_pic: profilePic,
					google_token: accessToken,
					google_refresh_token: refreshToken,
				},
			});
			return done(null, user);
		} catch (err) {
			return done(err, false);
		}
	};

	const loginGoogleCallback = (req, res) => {
		const { user } = req;
		if (!user) {
			return res.status(500).json({ msg: 'Internal server error' });
		}
		// console.log("GOOGLE_CALLBACK : ");
		// console.log(user);
		if (req.isAuthenticated()) {
			const token = authService().issue({ id: user.user_id });
			return res.status(200).json({ token, user });
		}
		return res.status(401).json({ msg: 'Unauthorized' });
	};

	async function getGoogleProfile(accessToken) {
		try {
			const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
			// return {email: res.data.email, picture: res.data.picture};
			return res.data.email;
		} catch (err) {
			throw err;
		}
	}

	// Youtube auth
	// Auto sign up if user doesn't exist
	const loginYoutube = async (accessToken, refreshToken, profile, done) => {
		// eslint-disable-next-line no-param-reassign, no-underscore-dangle
		profile = profile._json;
		/*
			SAMPLE profile
			{
				"kind": "youtube#channelListResponse",
				"etag": "lkj7Aml-jpY96F6UGXFIrJsC6Z8",
				"pageInfo": {
					"totalResults": 1,
					"resultsPerPage": 5
				},
				"items":
				[{
					"kind": "youtube#channel",
					"etag": "9EaG4wvbFZgESbPxf7X71F7DGiM",
					"id": "UCpKtpPehyXFOZjgM3iUSiFw",
					"snippet": {
						"title": "Zak Lance",
						"description": "",
						"publishedAt": "2016-10-22T20:52:09Z",
						"thumbnails": {
							"default": {
								"url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s88-c-k-c0x00ffffff-no-rj",
								"width": 88,
								"height": 88
							},
							"medium": {
								"url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s240-c-k-c0x00ffffff-no-rj",
								"width": 240,
								"height": 240
							},
							"high": {
								"url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s800-c-k-c0x00ffffff-no-rj",
								"width": 800,
								"height": 800
							}
						},
						"localized": {
							"title": "Zak Lance",
							"description": ""
						}
					}
				}]
			}

			{
				provider: 'youtube',
				id: 'UCpKtpPehyXFOZjgM3iUSiFw',
				displayName: 'Zak Lance',
				_raw: '{\n' +
					'  "kind": "youtube#channelListResponse",\n' +
					'  "etag": "lkj7Aml-jpY96F6UGXFIrJsC6Z8",\n' +
					'  "pageInfo": {\n' +
					'    "totalResults": 1,\n' +
					'    "resultsPerPage": 5\n' +
					'  },\n' +
					'  "items": [\n' +
					'    {\n' +
					'      "kind": "youtube#channel",\n' +
					'      "etag": "9EaG4wvbFZgESbPxf7X71F7DGiM",\n' +
					'      "id": "UCpKtpPehyXFOZjgM3iUSiFw",\n' +
					'      "snippet": {\n' +
					'        "title": "Zak Lance",\n' +
					'        "description": "",\n' +
					'        "publishedAt": "2016-10-22T20:52:09Z",\n' +
					'        "thumbnails": {\n' +
					'          "default": {\n' +
					'            "url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s88-c-k-c0x00ffffff-no-rj",\n' +
					'            "width": 88,\n' +
					'            "height": 88\n' +
					'          },\n' +
					'          "medium": {\n' +
					'            "url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s240-c-k-c0x00ffffff-no-rj",\n' +
					'            "width": 240,\n' +
					'            "height": 240\n' +
					'          },\n' +
					'          "high": {\n' +
					'            "url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s800-c-k-c0x00ffffff-no-rj",\n' +
					'            "width": 800,\n' +
					'            "height": 800\n' +
					'          }\n' +
					'        },\n' +
					'        "localized": {\n' +
					'          "title": "Zak Lance",\n' +
					'          "description": ""\n' +
					'        }\n' +
					'      }\n' +
					'    }\n' +
					'  ]\n' +
					'}\n',
				_json: {
					kind: 'youtube#channelListResponse',
					etag: 'lkj7Aml-jpY96F6UGXFIrJsC6Z8',
					pageInfo: { totalResults: 1, resultsPerPage: 5 },
					items: [{
						"kind": "youtube#channel",
						"etag": "9EaG4wvbFZgESbPxf7X71F7DGiM",
						"id": "UCpKtpPehyXFOZjgM3iUSiFw",
						"snippet": {
							"title": "Zak Lance",
							"description": "",
							"publishedAt": "2016-10-22T20:52:09Z",
							"thumbnails": {
								"default": {
									"url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s88-c-k-c0x00ffffff-no-rj",
									"width": 88,
									"height": 88
								},
								"medium": {
									"url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s240-c-k-c0x00ffffff-no-rj",
									"width": 240,
									"height": 240
								},
								"high": {
									"url": "https://yt3.ggpht.com/ytc/AAUvwngvP-kjJsw-C6tBdCcIw6h4T-cehEL-6MiKDStU=s800-c-k-c0x00ffffff-no-rj",
									"width": 800,
									"height": 800
								}
							},
							"localized": {
								"title": "Zak Lance",
								"description": ""
							}
						}
					}]
				}
			}
		*/
		// console.log(profile.items[0].snippet);

		try {
			const email = await getGoogleProfile(accessToken);

			// eslint-disable-next-line no-unused-vars
			const [user, created] = await User.findOrCreate({
				where: { email },
				defaults: {
					name: profile.items[0].snippet.title,
					password: accessToken,
					profile_pic: profile.items[0].snippet.thumbnails.medium.url,
					youtube_token: accessToken,
					youtube_refresh_token: refreshToken,
				},
			});
			return done(null, user);
		} catch (err) {
			return done(err, false);
		}
	};

	const loginYoutubeCallback = (req, res) => {
		const { user } = req;
		if (!user) {
			return res.status(500).json({ msg: 'Internal server error' });
		}

		if (req.isAuthenticated()) {
			const token = authService().issue({ id: user.user_id });
			return res.status(200).json({ token, user });
		}
		return res.status(401).json({ msg: 'Unauthorized' });
	};

	const updateProfilePic = async (req, res) => {
		try {
			User.update(
				{ profile_pic: req.file.filename },
				{ where: { user_id: req.token.id } },
			);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
		return res.status(200).json({});
	};

	const updateFields = async (req, res) => {
		const fields = Object.keys(req.body);
		console.log(fields);
		const updateData = {};

		fields.forEach((field) => {
			if (allowedFields.includes(field)) {
				updateData[field] = req.body[field];
			}
		});

		console.log(updateData);

		try {
			const nrows = await User.update(updateData, { where: { user_id: req.token.id } });
			if (nrows[0] > 0) {
				return res.status(200).json({});
			}
			return res.status(500).json({ msg: 'Internal server error' });
		} catch (err) {
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	const deleteUser = async (req, res) => {
		// TODO: Remove creator profile, pacts, posts, free up memory, etc
		if (req.body.password) {
			try {
				const user = await User.findByPk(req.token.id);

				if (!user) {
					return res.status(400).json({ msg: 'Bad Request: User not found' });
				}

				if (bcryptService().comparePassword(req.body.password, user.password)) {
					user.destroy();
					return res.status(200).json({ user });
				}

				return res.status(401).json({ msg: 'Unauthorized' });
			} catch (err) {
				console.log(err);
				return res.status(500).json({ msg: 'Internal server error' });
			}
		}
		return res.status(400).json({ msg: 'Bad Request' });
	};

	const validate = (req, res) => {
		const { token } = req.body;

		authService().verify(token, (err) => {
			if (err) {
				return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
			}

			return res.status(200).json({ isvalid: true });
		});
	};

	const getAll = async (req, res) => {
		try {
			const users = await User.findAll();

			return res.status(200).json({ users });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: 'Internal server error' });
		}
	};

	return {
		register,
		login,
		loginGoogle,
		loginGoogleCallback,
		loginYoutube,
		loginYoutubeCallback,
		updateProfilePic,
		updateFields,
		deleteUser,
		validate,
		getAll,
	};
};

module.exports = UserController;
