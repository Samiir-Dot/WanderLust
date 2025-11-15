if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpError = require('./utils/ExpError.js');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.js');

const listingRouter = require('./Routes/listing.js');
const reviewRouter = require('./Routes/review.js');
const userRouter = require('./Routes/user.js');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);

const dbUrl = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbUrl);   //"mongodb://127.0.0.1:27017/wanderlust" //connection b/w app abd DB is a async process
}
main()
.then((result)=>{
    console.log("connection successfull");
})
.catch((err=>{
    console.log(err);
}))

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60
    
});

store.on("error",() => {
    console.log("Error in MONGO SESSION STORE",err)
})

const sessionOptions = { 
    store, //session related info will be saved at mono atlas instead of server side default memory store
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires:Date.now() + 7 * 24 * 60 * 60*1000,
        maxAge:7 * 24 * 60 * 60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
app.use(flash()); //should be written before the routers

// FIX: Ensure session is saved before redirect
app.use((req, res, next) => {
    const redirect = res.redirect;
    res.redirect = function (...args) {
        req.session.save(() => redirect.apply(res, args));
    };
    next();
});


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); //imp to call next here
})

// ✅ GLOBAL DEFAULTS FOR EJS VARIABLES
app.use((req, res, next) => {
  if (typeof res.locals.search === 'undefined') res.locals.search = '';
  if (typeof res.locals.category === 'undefined') res.locals.category = '';
  next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.get("/", (req, res) => {
  res.redirect("/listings");
});

//random route
app.use((req,res,next)=>{
    next(new ExpError(404,"Page Not Found!"));
})
app.use((err,req,res,next)=>{
    // console.log(err);
    let {statusCode=500,message} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});