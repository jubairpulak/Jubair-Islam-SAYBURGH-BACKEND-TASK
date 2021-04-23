const express = require("express")
const cors = require("cors")
const morgan = require('morgan')
const ratelimit = require("express-rate-limit")
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
// const fs = require('fs')
const UserRoute = require("./Routes/UserRoutes")
const BlogRoute = require("./Routes/BlogRoutes")

//catcherror
const AppError = require("./Utils/appError")
//error handler
const globalErrorHanlder = require("./Controllers/handleError")

const app = express()


if(process.env.NODE_ENV  === "development"){
    app.use(morgan("dev"))
}
app.use(compression())
app.use(helmet())
app.use(express.json({limit : "2mb"}))

app.use(mongoSanitize())

app.use(xss());

app.use(cors())

app.use("/api", UserRoute)
app.use("/api/blog", BlogRoute)

app.all("*", (req, res, next)=>{
    next (new AppError(`Can't find ${req.originalUrl}`, 404))
})


app.use(globalErrorHanlder)

module.exports = app