const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const BlogModel = require("../Models/BlogsModel");
const CommentModel = require("../Models/CommentModel");
const {filterObj, updateUserInfo} = require("./formatFactory")

const {sendCorrectMessage} = require("../Utils/sendMessage")

exports.createBlog = catchAsync(async (req, res, next) => {
	const { title, description, tags } = req.body;

	const createdBy = req.user._id;

	const userdata = await BlogModel.create({
		title,
		description,
		tags,
		createdBy,
	});
	sendCorrectMessage(res, 201, "success", userdata)
	
});
exports.getallspost = catchAsync(async (req, res, next) => {
	const getalldata = await BlogModel.find({}).lean().populate({path : "comments", select : "name text -_id"});

	sendCorrectMessage(res, 201, "success", getalldata)
	
});


exports.deleteblogs = catchAsync(async( req, res, next)=>{
	const _id  = req.user._id;
	const id = req.params.id;
	 console.log(_id , id)
	 const findpostbelongstoid = await BlogModel.findOneAndRemove({_id : id}).where({createdBy : _id})
	 const deleteComment = await CommentModel.findOneAndRemove({post : id})
	 
	console.log("find data ; ", findpostbelongstoid)
	if(!findpostbelongstoid ) return next (new AppError("You have no right to access it", 403))
	sendCorrectMessage(res, 201, "success", "Post has been deleted")
})







exports.updateBlogs = catchAsync(async( req, res, next)=>{
	const _id  = req.user._id;
	const id = req.params.id;
	
	
	 const findpostbelongstoid = await BlogModel.findOne({_id : id, createdBy : _id})
	 
	if(!findpostbelongstoid ) return next (new AppError("You have no right to access it", 403))

	const filterbody = filterObj(req.body, "tags", "title","description" )

	const updatedata = updateUserInfo(filterbody, id, res, BlogModel)
	
})

