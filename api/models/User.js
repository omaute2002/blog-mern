const mongoose = require("mongoose")

// to not type schema everytime 
const {Schema, model} = mongoose;
const UserSchema = new Schema({
    username: {type: String, required:true, min:4, unique:true},
    password: {type:String, required:true},
})

// creating the model in mongodb that will get saved

const UserModel = model('User', UserSchema)

// to use usemodel inside main index.js file in api folder

module.exports = UserModel;
