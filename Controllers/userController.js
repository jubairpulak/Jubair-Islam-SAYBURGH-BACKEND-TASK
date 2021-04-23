const catchAsync = require("../Utils/catchAsync")

const UserModel = require("../Models/UserModel")
const { sendCorrectMessage} = require("../Utils/sendMessage")


exports.getMe = catchAsync(async (req, res)=>{

    let UserInfo =  await UserModel.findById({_id : req.user._id})
   
    sendCorrectMessage(res, 201, "success", UserInfo)
})