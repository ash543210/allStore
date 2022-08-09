const express = require('express')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user')
const Product = require('../models/product')
let returnTo = ''

module.exports.renderRegister = (req, res) => {
    res.render('register')
}

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to AllStore!');
        res.redirect('/');
    })
}

module.exports.renderLogin = async (req, res) => {
    returnTo = req.session.returnTo;
    // console.log(req.session.returnTo)
    if (req.user) {
        res.redirect('/')
    }
    res.render('login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'welcome back!');
    const redirect = returnTo || '/'
    res.redirect(redirect)
}

module.exports.logout = async (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
    // req.session.destroy();
    // req.flash('success', "Goodbye!");
    // res.redirect('/');
}

module.exports.renderCart = async (req, res) => {
    const user = await User.findById(req.params.userId).populate('products')
    res.render('cart', { user })
}

module.exports.addToCart = async (req, res) => {
    const user = await User.findById(req.params.userId)
    const product = await Product.findById(req.params.productId)
    user.products.push(product)
    await user.save()
    console.log(user.products)
    res.redirect(`/${req.params.userId}/cart`)
}

module.exports.removeProduct = async (req, res) => {
    const user = await User.findById(req.params.userId)
    const product = await Product.findById(req.params.productId)
    await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { products: req.params.productId } });
    res.redirect(`/${req.params.userId}/cart`)
}