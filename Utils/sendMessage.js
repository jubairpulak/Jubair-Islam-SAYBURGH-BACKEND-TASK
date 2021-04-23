exports.sendCorrectMessage = (res, statusCode, status, message) =>{
    res.status(statusCode).json({
		status ,
		data :{
            message
        } 
	})
}
