const dotenv = require("dotenv")
const Connection = require("./connection")
const app = require("./app")
dotenv.config({path: './.env'})

console.log(app.get('env'))

Connection()
const port = process.env.PORT || 8080

app.listen(port, (req, res)=> console.log(`App is listening on port no : ${port}`))