const express = require('express');
const router = express.Router({mergeParams:true});  //willl use router object and not app here
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpError = require('../utils/ExpError.js');
const { validateReview,isLoggedIn,isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');



//Reviews
//post route

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.postReview));

//delete route (we need to delete the review from both reveiw Db and the listing.reviews array(it stores review id))

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports = router;
