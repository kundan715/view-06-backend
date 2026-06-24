import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"
// import { useActionState } from "react";

const userRouter=Router();

//now when all calls this route :it will check which is next

userRouter.route("/register").post(registerUser);

export {userRouter}

