const express = require('express')
const router = express.Router()
const users = require('../controllers/user')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn, isAuthor } = require('../middleware')
const catchAsync = require('../utils/catchAsync.js');


router.route('/register')
    .get((users.renderRegister))
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.route('/logout')
    .get(isLoggedIn, users.logout)

router.route('/:userId/cart')
    .get(isLoggedIn, catchAsync(users.renderCart))

router.route('/:userId/:productId/cart')
    .post(isLoggedIn, catchAsync(users.addToCart))
    .delete(isLoggedIn, isAuthor, catchAsync(users.removeProduct))

module.exports = router