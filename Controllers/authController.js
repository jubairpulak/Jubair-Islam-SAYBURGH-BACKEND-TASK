const catchAsync = require("../Utils/catchAsync")
const AppError = require("../Utils/appError")
const UserModel = require("../Models/UserModel")
const JWT = require("jsonwebtoken")
const {promisify} = require("util")
const { sendCorrectMessage} = require("../Utils/sendMessage")
const {filterObj, updateUserInfo} = require("./formatFactory")


const sendResponse = (res, type, statusCode, token, user)=>{
res.status(statusCode).json({
    status: type,
    token,
    data:{
        
      data:  user
    }
})
}

const signInToken = (id) => JWT.sign({id}, process.env.JWT_SECRET , {
    expiresIn : process.env.JWT_COOKIE_EXPIRES_IN
})

const sendToken = (user, statusCode, res, req) =>{
    const token = signInToken(user._id)
    const cookieOptions = {
        expires : new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 *60 *1000

        ),
        httpOnly : true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'

    }

    if(process.env.NODE_ENV  === 'production') cookieOptions.secure = true
    user.password = undefined
    res.cookie('jwt', token, cookieOptions)
    sendResponse(res, "success", statusCode, token, user)
}

exports.registerAccount = catchAsync(async (req, res, next)=>{
    const {firstname, lastname, email, password, confirmPassword} = req.body
    
    
   const findUser = await UserModel.findOne({email})
   const saveUserData = await UserModel.create({
    firstname, lastname, email, password, confirmPassword
   })

   sendToken(saveUserData, 201, res, req)
})

exports.login = catchAsync(async (req, res, next) =>{
    const {email, password} = req.body

    if(!email || !password) return next(new AppError("Email or password field is empty"), 404);

    
        
         const getUser =await UserModel.findOne({email}).select("+password")
         if(getUser.active == false) return next(new AppError("This accoutn has been deactivated"), 403)
         if(!getUser) return next(new AppError("Email is not found"))
     
         const verifyUserPassword = await UserModel.compareUserPassword(getUser.password, password)
         
         if(!verifyUserPassword) return next(new AppError("Email and password are not matched", 401))
         sendToken(getUser, 201, res, req)
    
} )

exports.protect = catchAsync(async(req, res, next)=>{
    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    const decodeToken =await promisify(JWT.verify)(token, process.env.JWT_SECRET );

    console.log(decodeToken.iat)
    const findUser = await UserModel.findById({
    _id : decodeToken.id
    }).select("+password")

    if(findUser.active == false) return next(new AppError("This account has been deactivated", 401))
    const verifyResetToken = await findUser.changePasswordAfter(decodeToken.iat)

  if(verifyResetToken) return next(new AppError("Invalid Token, Please login Again", 403))

  req.user = findUser._id
  next()
})

exports.updatePassword = catchAsync(async(req, res, next)=>{
    const {currentPassword, newPassword, confirmPassword} = req.body
    if(!currentPassword || !newPassword || !confirmPassword) return next (new AppError("Current Password , new Password and conirm password field must not be empty"), 401);

    const {_id} = req.user
    const user= await UserModel.findById(_id).select("+password")
    console.log("password is ehre", user.password)
    const {password} = user;

    const checkPasswordisMatched = await UserModel.compareUserPassword(password, currentPassword)
    if(!checkPasswordisMatched) return next(new AppError("Enter valid Current Password", 403))

    //update password
    user.password = newPassword;
    user.confirmPassword = confirmPassword;
   
    await user.save()
    console.log("user data :", user)
    sendToken(user, 201, res, req)

})



exports.deactiveUser = catchAsync(async(req, res, next)=>{

    req.user.active = false;
    await req.user.save({validateBeforeSave: false})
    sendCorrectMessage(res, 201, 'success', "you account has been deactivated successfully")
   
    
})

exports.updateMe = catchAsync(async(req, res, next)=>{

    const filterbody = filterObj(req.body, "firstname", "lastname" )
     updateUserInfo(filterbody, req.user._id, res, UserModel)


})



exports.logout = catchAsync(async( req, res, next) =>{
    res.cookie('jwt',  "loggedout",{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
       
    })

    
    res.status(201).json({status : "success", message : "You have logged out"})
})






