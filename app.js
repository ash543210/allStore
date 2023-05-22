const express = require("express");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const methodOverride = require("method-override");
const session = require("express-session");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const reviewRoutes = require("./routes/review");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const dbUrl =
  "mongodb+srv://ash54321:fjvIH5itD1e7UT8G@cluster0.si5umyq.mongodb.net/?retryWrites=true&w=majority" ||
  "mongodb://localhost:27017/all-store";

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const secret = "secret";

const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 60 * 60 * 60 * 60,
    maxAge: 60 * 60 * 60 * 60,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// })

app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", reviewRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh No, Something Went Wrong!";
  }
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server up and running");
});
