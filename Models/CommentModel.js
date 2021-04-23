const mongoose = require('mongoose');

const validator = require('validator')
const appError = require("../utils/appError")
const bcryptjs = require("bcryptjs")
const crypto = require("crypto")
const {ObjectId} = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    text : {
        type : String,
        trim : true,
        required : [true, "each comment must have some text"]
    },
    date : {
        type : Date,
        default : Date.now
    },
    name : String,
    post:{
        type : ObjectId,
        ref : "BlogSchemas"
    }
})

module.exports = mongoose.model('Comment', commentSchema)