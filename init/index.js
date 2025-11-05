//the purpose of this file is to input sample data in the database
// const mongoose = require('mongoose');
// const initData = require("./data.js");

// const Listing = require("../models/listing.js")

// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); //connection b/w app abd DB is a async process
// }
// main()
// .then((result)=>{
//     console.log("connection successfull");
// })
// .catch((err=>{
//     console.log(err);
// }))

// const initDb = async ()=>{
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj)=>({
//     ...obj,
//     owner:"68ee44cb42ffa800cc3556fc"}));
//     await Listing.insertMany(initData.data);
//     console.log("data was initialised");
// }

// initDb();

// seed.js — used to input sample data in the database

if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
  .then(() => console.log('Connection successful'))
  .catch((err) => console.log(err));

const initDb = async () => {
  await Listing.deleteMany({});
  console.log('Deleted all old listings.');

  for (let obj of initData.data) {
    // Get coordinates for the location
    const geoResponse = await geocodingClient
      .forwardGeocode({
        query: obj.location,
        limit: 1,
      })
      .send();

    // Create a new listing with geometry + owner
    const listing = new Listing({
      ...obj,
      owner: '68ee44cb42ffa800cc3556fc', // your test user ID
      geometry: geoResponse.body.features[0].geometry,
    });

    await listing.save();
    console.log(`Inserted: ${listing.title}`);
  }

  console.log('Data initialized successfully!');
};

initDb();
