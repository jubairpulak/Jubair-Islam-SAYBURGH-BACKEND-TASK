const mongoose = require('mongoose');

const validator = require('validator')
const appError = require("../utils/appError")
const bcryptjs = require("bcryptjs")
const crypto = require("crypto")
const {ObjectId} = mongoose.Schema;

const BlogSchema = new mongoose.Schema({
    title:{
        type : String,
        required: [true, "Each blog must have a tytle"]
    },

    description:{
        type : String,
        required : [true, "Each blog must be described"]
    },
    tags:[String],
    comments:[{
        type : ObjectId,
        ref : "Comment"
    }],
    slug:String,
    createdBy:{
        type : ObjectId,
        ref : "Userschema"
    }
},{timestamps : true})

module.exports = mongoose.model("BlogSchemas", BlogSchema)