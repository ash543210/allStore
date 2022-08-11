const express = require('express')
const router = express.Router()
const products = require('../controllers/product')
const product = require('../models/product')
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const { isLoggedIn, isAuthor, validateProduct, validateReview } = require('../middleware')
const catchAsync = require('../utils/catchAsync');
// const { validateProduct, validateReview } = require('../utils/ExpressError')

router.route('/')
    .get(catchAsync(products.index))

router.route('/products')
    .get(catchAsync(products.index))

router.route('/products/new')
    .get(isLoggedIn, catchAsync(products.createProduct))
    .post(isLoggedIn, upload.array('image'), validateProduct, catchAsync(products.saveProduct))

router.route('/products/:id')
    .get(products.showProduct)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProduct, catchAsync(products.updateProduct))
    .delete(isLoggedIn, isAuthor, catchAsync(products.deleteProducts))

router.route('/products/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(products.editProduct))



module.exports = router;