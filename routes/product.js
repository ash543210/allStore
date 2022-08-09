const express = require('express')
const router = express.Router()
const products = require('../controllers/product')
const product = require('../models/product')
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const { isLoggedIn, isAuthor, validateProduct, validateReview } = require('../middleware')
// const catchAsync = require('../utils/catchAsync.js');



router.route('/')
    .get((products.index))

router.route('/new')
    .get(isLoggedIn, (products.createProduct))
    .post(isLoggedIn, upload.array('image'),  (products.saveProduct))

router.route('/:id')
    .get(products.showProduct)
    .put(isLoggedIn, isAuthor, upload.array('image'),  (products.updateProduct))
    .delete(isLoggedIn, isAuthor, (products.deleteProducts))

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, (products.editProduct))



module.exports = router;