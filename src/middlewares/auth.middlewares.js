import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandlerFun";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models"

const jwtVerify= asyncHandler(async (req,res,next)=>{
    //we have cookies in req properties it sent by browser alwyas when it have 
    // as we sent while login 
    //we can access token by header if it provide (in mobile aplcations);
    try{
    const accessCookie= req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ","");

    //now get orignal user value by using jwt decoder
    if(!accessCookie){
        throw new ApiError(404 ,"unathorised request")
    }


    const decodeToken =jwt.verify(accessCookie,process.env.ACCESS_TOKEN_SECRET);

    //get user by id of decodetoken 
    const user = User.findById(decodeToken._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(404,"invalid accessToken");
    }

    req.user=user;
    next();
    }
    catch(error){
        throw new ApiError(401,error?.message||"Invalid user")
    }

})

export {jwtVerify}