if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../models/user');
const Product = require('../models/product')
const Review = require('../models/review')
const { cloudinary } = require("../cloudinary/index");

const dbUrl = 'mongodb://localhost:27017/all-store';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const deleteProducts = async function () {
    const products = await Product.find({})
    for(let product of products) {
        for(let image of product.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
    }
    await Product.deleteMany({})
} 

const deleteUsers = async function () {
    await User.deleteMany({})
} 

const deleteReviews = async function () {
    await Review.deleteMany({})
} 

deleteProducts().then(() => {
    mongoose.connection.close();
})

