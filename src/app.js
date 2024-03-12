// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import userRouter from "./routes/user.routes.js"

// const app = express();

// // app.use(cors({
// //     origin: process.env.CORS_ORIGIN,
// //     credentials: true
// // }))

// app.use(express.json({ limit: "16kb" })) //handle json data
// app.use(express.urlencoded({ extended: true, limit: "16kb" })) //handle url data
// app.use(express.static("public"))  //store static data on machine
// app.use(cookieParser())  //handle cookie of user

// app.use((req,res)=>{
//     console.log("Request",req.path)
// })
// app.use("/api/v1/users",userRouter)

// export { app }; 

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'

app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

export { app }