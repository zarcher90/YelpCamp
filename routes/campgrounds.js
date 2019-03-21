const express = require('express');
const Campground = require('../models/campground');
const middleware = require('../middleware');

const router = express.Router();

// Index campgrounds route
router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

// Create campground route
router.post('/', middleware.isLoggedIn, (req, res) => {
  const {
    name, price, image, description,
  } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  Campground.create({
    name,
    price,
    image,
    description,
    author,
  }, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    }
  });
  res.redirect('/campgrounds');
});

// New campground form route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// Show campground route
router.get('/:id', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});

// Edit campground form route
router.get('/:id/edit', middleware.isLoggedIn, middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      res.render('campgrounds/edit', { campground: foundCampground });
    }
  });
});

// Update campground route
router.put('/:id', middleware.isLoggedIn, middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Destroy campground route
router.delete('/:id', middleware.isLoggedIn, middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      req.flash('success', 'Campground has been deleted!');
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
