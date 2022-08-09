const Product = require('../models/product')
const Review = require('../models/review')
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const { findByIdAndDelete } = require('../models/user');
const upload = multer({ storage });

module.exports.index = async (req, res) => {
    const products = await Product.find({})
    res.render('home', { products })
}

module.exports.showProduct = async (req, res) => {
    await Product.findById(req.params.id)
        .then(async () => {
            const product = await Product.findById(req.params.id).populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            }).populate('seller')
            const currentUser = req.user
            res.render('product/show', { product, currentUser })
        })
        .catch((err) => {
            req.flash('error', 'Cannot find that product!');
            console.log(err)
            return res.redirect('/')
        })
}

module.exports.editProduct = async (req, res) => {
    await Product.findById(req.params.id).populate('seller')
        .then(async () => {
            const product = await Product.findById(req.params.id).populate('seller')
            res.render('product/edit', { product })
        })
        .catch((err) => {
            req.flash('error', 'Cannot find that product!');
            console.log(err)
            return res.redirect('/')
        })
}

module.exports.createProduct = async (req, res) => {
    if (res.locals.currentUser) {
        res.render('products/new')
    }
    else {
        res.render('login')
    }
}

module.exports.saveProduct = async (req, res) => {
    const { name, description, price } = req.body
    const product = new Product(req.body.product)
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.seller = req.user._id
    await product.save()
    req.flash('success', 'Successfully made a new product!');
    res.redirect(`/${product._id}`)
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    if (req.files) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        product.images.push(...imgs);
    }
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated product!');
    res.redirect(`/${product._id}`)
}

module.exports.deleteProducts = async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    if (product) {
        for(let image of product.images){
            await cloudinary.uploader.destroy(image.filename);
        }
        await Product.findByIdAndDelete(id)
        req.flash('success', 'Successfully deleted product')
    }
    res.redirect('/')
}