import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middlewares.js"
import {authFunction} from "../middlewares/auth.middlewares.js"

// import { useActionState } from "react";

const userRouter=Router();

//now when all calls this route :it will check which is next


//here we are add the multer midellware to sstore the sent files 
userRouter.route("/register").post(
    upload.fields(
        [{
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }]
    ),
    registerUser);

//new routes
userRouter.route("/login").post(loginUser)//no middleware require


//secure routes
userRouter.route("logoutUser").post(
    authFunction,
    logoutUser
)

userRouter.route("refresh-accessToken").post(refreshAccessToken)

export {userRouter}

