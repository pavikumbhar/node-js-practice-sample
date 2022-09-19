const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const fetchUser = require('../middleware/fetchUser-middleware');

//1] Create user  
router.post('/user', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {

  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ errors: 'User already exist with email' });

    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);


    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
  

    const data = {
      id: user.id,
      name: user.name
    }

    let authToken = jwt.sign(data, process.env.JWT_SECRET);
    res.status(200).json({ authToken });


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});

//2] login user  
router.post('/login', [
          body('email', 'Enter a valid email').isEmail(),
          body('password', 'Password con not be blank').exists(),
          ], async (req, res) => {

  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ errors: 'email or password are invalid' });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: 'email or password are invalid' });
    }

    const data = {
      id: user.id,
      name: user.name
    }

    let authToken = jwt.sign(data, process.env.JWT_SECRET);
    res.status(200).json({ authToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});


//3] login user
router.get('/user', fetchUser, async (req, res) => {
  const { id } = req.user;
  console.log(id);
  try {
      const user = await User.findById(id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});
module.exports = router;