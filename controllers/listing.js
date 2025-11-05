let Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

// module.exports.index = async (req,res)=>{
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// };

module.exports.index = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        // ✅ If category filter selected
        if (category) {
            query.category = category;
        }

        // ✅ If search term entered
        if (search && search.trim() !== "") {
            const regex = new RegExp(search, "i"); // case-insensitive search
            query.$or = [
                { title: regex },
                { location: regex },
                { country: regex },
                { description: regex },
                { category: regex }
            ];
        }

        // ✅ Fetch listings based on query
        const allListings = await Listing.find(query);

        // ✅ Render index page and pass active filters/search
        res.render("listings/index.ejs", { allListings, category, search });
    } catch (err) {
        console.error("Error fetching listings:", err);
        req.flash("error", "Something went wrong while loading listings!");
        res.redirect("/");
    }
};




module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","listing you requested for does not Exist!");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }
};

module.exports.createListing = async (req,res,next)=>{  // let{title,description,image,price,country,location} = req.body;
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send()

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    // console.log(savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not Exist!");
        res.redirect("/listings");
    }
    let ogImgUrl = listing.image.url;
    ogImgUrl = ogImgUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,ogImgUrl}); //this listings/ is imp
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        req.body.listing.image = {url,filename}
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{  //all crud operations are asynchronous in nature so async await is very IMP
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};