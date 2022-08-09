const express = require('express')
const router = express.Router()
const reviews = require('../controllers/review')
const { isLoggedIn, isAuthor, validateProduct, validateReview } = require('../middleware')
// const catchAsync = require('../utils/catchAsync.js');


router.route('/:id/reviews')
    .post(isLoggedIn,  (reviews.postReview))

router.route('/:id/reviews/:reviewId')
    .delete(isLoggedIn, isAuthor, (reviews.deleteReview))

module.exports = router