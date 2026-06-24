import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middlewares.js"
// import { useActionState } from "react";

const userRouter=Router();

//now when all calls this route :it will check which is next


//here we are add the multer midellware to sstore the sent files 
userRouter.route("/register").post(
    upload.fields(
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ),
    registerUser);

export {userRouter}

