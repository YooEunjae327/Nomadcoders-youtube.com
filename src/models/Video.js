import mongoose from "mongoose";

const vidoeSchema = new mongoose.Schema({
    title : String,
    description : String,
    createdAt : Date,
    hashtags : [{type : String}],
    meta : {
        views : Number,
        rating : Number,
    }, 
})

const Video = mongoose.model('Video', vidoeSchema)

export default Video