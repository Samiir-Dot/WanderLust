const express = require('express');
const router = express.Router();  //willl use router object and not app here
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn,validateListing,isOwner} = require('../middleware.js');
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        validateListing,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing));
    // .post(upload.single("listing[image]"),(req,res) => {
    //     res.send(req.file);
    // })

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
    isOwner,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing))
    .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));



//create a new listing
//1] step 1 render a form for inputs{new route}
// router.get("/new",isLoggedIn,listingController.renderNewForm);

//2]add the value from input to DB  (create route)
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//show all listings{index route}
// router.get("/",wrapAsync(listingController.index));

//show individual listing{show route}
// router.get("/:id",wrapAsync(listingController.showListing)); 

//edit route   (update listing)
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing));

//delete route
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroyListing));

module.exports = router;




