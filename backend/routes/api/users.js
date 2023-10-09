const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  // check('username')
  //   .not()
  //   .isEmail()
  //   .withMessage('Username cannot be an email.'),
  check('firstName')
  .exists({ checkFalsy: true })
  .withMessage('First Name is required'),
  check('lastName')
  .exists({ checkFalsy: true })
  .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;
    //error handling here before creating user
    // TODO need to split into helper functions long term
    //! validate it is a unique email
    const userWithEmailExists = await User.findOne(
      { 
        where: {
          email
        }
      }
    );

    if(userWithEmailExists){
      const err = new Error("User already exists");
      err.errors = {email: "User with that email already exists"};
      err.status = 500;
      return next(err);
    }

    //! validate it is a unique username
    const userWithUsernameExists = await User.findOne(
      { 
        where: {
          username
        }
      }
    );

    if(userWithUsernameExists){
      const err = new Error("User already exists");
      err.errors = {username: "User with that username already exists"};
      err.status = 500;
      return next(err);
    }


    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName:user.lastName,
      email: user.email,
      username: user.username,
    };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;
