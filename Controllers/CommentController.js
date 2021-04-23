const catchAsync = require("../Utils/catchAsync")
const BlogModel = require("../Models/BlogsModel")
const UserModel = require("../Models/UserModel")
const CommentModel = require("../Models/CommentModel")
const {sendCorrectMessage} = require("../Utils/sendMessage")

exports.doCommenting = catchAsync(async(req, res)=>{
    const id = req.params.id;
   const user = await UserModel.findById({_id : req.user._id})
    const {firstname} = user;
    const comment = new CommentModel({
        text : req.body.text,
        name : firstname,
        post : id
    })

    await comment.save();
    const postRelated = await BlogModel.findById(id);
    postRelated.comments.push(comment);

    await postRelated.save();

    sendCorrectMessage(res, 201, "success", postRelated)

})