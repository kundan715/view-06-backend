import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app= express();

dotenv.config();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));
app.use(cookieParser());

//routes import 
import {userRouter} from "./routes/userRouter.js"


//routes delclaration

app.use("/api/v1/user",userRouter);
//this is starting route :localhost:800/api/v1/user -then specifict route will will be
//handel by userRouter like : /register or /login  or which defined in userRouter

export  {app};









// app.js → forwards request
// routes → selects controller
// controller → handles logic
// model → communicates with database
// database → stores/retrieves data
// response → sent back to client