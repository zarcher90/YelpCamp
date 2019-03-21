const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

// Middleware to check that user is loggedin
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please Login!');
  res.redirect('/login');
};

// Checking if current user owns the Campground selected
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else if (foundCampground.author.id.equals(req.user._id)) {
      next();
    } else {
      req.flash('error', 'You are not the owner!');
      res.redirect('back');
    }
  });
};

// Checking if current user owns the comment selected
middlewareObj.checkCommentOwnership = (req, res, next) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      req.flash('error', 'Campground does not exist!');
      res.redirect('back');
    } else if (foundComment.author.id.equals(req.user._id)) {
      next();
    } else {
      req.flash('error', 'You are not the owner!');
      res.redirect('back');
    }
  });
};


module.exports = middlewareObj;
