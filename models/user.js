const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const passportLocalMongoose = require('passport-local-mongoose'); //we dont need to add filed for username and password as this pavkage will automatically define that for us

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose); //it will auto implement username,password aloong with hashing and salting

module.exports = mongoose.model("User",userSchema);