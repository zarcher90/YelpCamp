const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// Index main route
router.get('/', (req, res) => {
  res.render('landing');
});

// Register route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome to YelpCamp ${user.username}`);
      res.redirect('/campgrounds');
    });
  });
});

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}), (req, res) => {

});

// Logout route
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'Logged Out!');
  res.redirect('/');
});

module.exports = router;
