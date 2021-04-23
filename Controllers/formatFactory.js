const {sendCorrectMessage} = require("../Utils/sendMessage")

exports.filterObj = (obj, ...filteringobj)=>{
	let newObj = {}
	const data = Object.keys(obj).forEach(e =>{
		if(filteringobj.includes(e)) newObj[e] = obj[e]
	})
	return newObj
}


exports.updateUserInfo =async (obj, _id, res, Model)=>{

	const updateUser = await Model.findByIdAndUpdate({_id}, obj,{
		new : true, 
		runValidators : true
	} )

    sendCorrectMessage(res, 201, "success", "Your Request has been updated")
	
}


