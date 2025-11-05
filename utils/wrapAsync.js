module.exports = (fn)=>{
    return (req,res,next) => {
        fn(req,res,next).catch((err)=>next(err));
    }
}

// app.post("/listings",async (req,res,next)=>{  // let{title,description,image,price,country,location} = req.body;
//     try{
//         await new Listing(req.body.listing).save();
//     res.redirect("/listings");
//     }
//     catch(err){
//         next(err);
//     }
// });