const User = require('../models/user.js')
module.exports.renderSignUpform = (req,res)=>{
    res.render("../views/users/signup.ejs");
}
module.exports.signUp = async (req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newUser = new User({ email,username});
        const regUser = await User.register(newUser,password);
        // console.log(regUser);
        req.login(regUser,(err)=>{
            if(err) { return next(err); }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogInForm = (req,res)=>{
    res.render("users/login.ejs");
}
module.exports.logIn = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","logged out!");
        res.redirect("/listings");
    })
    
};