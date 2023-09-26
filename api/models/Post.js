const mongoose = require('mongoose')
const {Schema, model} = mongoose;

const postSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover:String, 
    author: String,
    // this will contain the filename of the image 
    // 
    
}, {
    timestamps: true, // to get updated at and created at time automatically


})

const PostModel = model('Post', postSchema);
module.exports = PostModel;