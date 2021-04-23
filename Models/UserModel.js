const mongoose = require('mongoose');

const validator = require('validator')
const bcryptjs = require("bcryptjs")

const userSchema = new mongoose.Schema({
    firstname :{
        type : String,
        
        required: [true, "User must have a name"],
    },
    lastname :{
        type : String,
        required :[true, "User must have a surname"],
    },
    
  
    email :{
        type : String,
        required: [true, "Each user must have a email"],
        unique : [true, "Email must be unique"],
        validate: [validator.isEmail, "Invalid Email"]
    },
    password:{
        type : String,
        required: [true, "Must have a password"],
        min:[6,"Password length must be more than 5"],
        select : false
    },
    confirmPassword:{
        type : String,
        required: [true, "Please conirm your password"],
        validate: {
            validator : function(el){
                return el === this.password
            },
            message : 'Both password are not matched'
        }
    },

    passwordChangedAt : Date,
    active :{
        type : Boolean,
        default : true,
        
    }

}, {timestamps : true})



userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;
    next()
})
userSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    console.log("hello bd ami password change")
    next()
})

userSchema.pre('/^find/', function(next){
    this.find({active:{$ne:'false'}})
    next()
})

userSchema.statics.compareUserPassword = (storedPass, inptuPass) =>{
    return bcryptjs.compare(inptuPass, storedPass);
}

userSchema.methods.changePasswordAfter = function(JWTTOKEN){
    console.log('hello bangladesh')
    if(this.passwordChangedAt){
        const newpasswordToken = parseInt(this.passwordChangedAt.getTime() /1000 , 10)
        console.log("newPassworTOken : ", newpasswordToken, "JWT : ", JWTTOKEN )
      return JWTTOKEN < newpasswordToken
    }
    return false;
}
module.exports = mongoose.model("Userschema", userSchema)