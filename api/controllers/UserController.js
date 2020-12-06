const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;
    //console.log(body);

    if (body.password === body.password2) {
      try {
        const user = await User.create({
          email: body.email,
          password: body.password,
        });
        const token = authService().issue({ id: user.id });

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
    //console.log(req.body);

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
          const token = authService().issue({ id: user.id });

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
    //console.log("GOOGLE_LOGIN : " + JSON.stringify(profile));
    try{
      const [user, created] = await User.findOrCreate({
        where: {email : profile.emails[0].value},
        defaults: {password : accessToken}
      });
      return done(null, user);
    } catch(err){
      return done(err, false);
    }
    
  };

  const loginGoogleCallback = (req, res) => {
    const user = req.user;
    if (!user){
      return res.status(500).json({ msg: 'Internal server error'});
    }
    //console.log("GOOGLE_CALLBACK : ");
    //console.log(user);
    if (req.isAuthenticated()){
      const token = authService().issue({ id: user.id });
      return res.status(200).json({token, user});
    }else {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
  }

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
    validate,
    getAll,
  };
};

module.exports = UserController;
