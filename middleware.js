const express = require('express')

const product = require('./models/product')
const Product = require('./models/product')
const { productSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')


module.exports.isLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.originalUrl)
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const product = await Product.findById(req.params.id || req.params.productId)
    if (!product.seller.equals(req.user._id)) {
        return res.send('No permission')
    }
    next()
}

// module.exports.validateProduct = async (req, res, next) => {
//     const { error } = productSchema.validate(req.body);
//     // console.log(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

// module.exports.validateReview = async (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }