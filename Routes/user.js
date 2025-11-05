const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/user.js');

router.route("/signup")
    .get(userController.renderSignUpform)
    .post(userController.signUp);

// router.get("/signup",userController.renderSignUpform);
// router.post("/signup",userController.signUp);

router.route("/login")
    .get(userController.renderLogInForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",{ 
            failureRedirect:'/login',
            failureFlash: true }),
        userController.logIn
    );

// router.get("/login",userController.renderLogInForm)
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{ 
//         failureRedirect:'/login',
//         failureFlash: true }),
//     userController.logIn
// );

router.get("/logout",userController.logOut)

module.exports = router;
