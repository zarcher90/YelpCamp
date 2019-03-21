const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

const router = express.Router({ mergeParams: true });

// New comment form route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// Create comment route
router.post('/', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
          req.flash('error', 'Woops Somthing Went Wrong!!');
          res.redirect('back');
        } else {
          // adding username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground.id}`);
        }
      });
    }
  });
});

// Edit comment form route
router.get('/:comment_id/edit', middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      res.render('comments/edit', { comment: foundComment, campgroundId: req.params.id });
    }
  });
});

// Update comment route
router.put('/:comment_id', middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Destroy comment route
router.delete('/:comment_id', middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Woops Somthing Went Wrong!!');
      res.redirect('back');
    } else {
      req.flash('success', 'Comment has been deleted!');
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;
