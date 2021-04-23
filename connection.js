const mongoose = require("mongoose")

const Connection = async()=>{
    try {
        const dbconnect = await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify : false
        } )

        console.log("Db Connected")
        
    } catch (err) {
        
        console.log(err)
    }
}
module.exports = Connection