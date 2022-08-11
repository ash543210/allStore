const Review = require('../models/review')
const Product = require('../models/product')


module.exports.postReview = async (req, res) => {
    const product = await Product.findById(req.params.id)
    const { body, rating } = req.body;
    const review = new Review(req.body.review)
    review.author = req.user._id
    await review.save()
    product.reviews.push(review)
    await product.save()
    req.flash('success', 'Created new review!');
    res.redirect(`/products/${product._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/products/${id}`)
}