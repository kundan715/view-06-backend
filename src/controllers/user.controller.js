import{ asyncHandler} from "../utils/asyncHandlerFun.js"
import  {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {cloudnary_file_upload} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

import jwt from "jsonwebtoken";

const accessAndRefreshTokenGenerator=async(userId)=>{

    try{const user= await User.findById(userId);
    const accessToken=user.accessTokenGenerator();
    const refreshToken = user.refreshTokenGenerator();

    //now update the refesh token filed of user
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});

    return {accesstoken ,refreshToken}}
    catch(error){
        throw new ApiError(500,"something went wrong while token gereration");
    }

}

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // });
    //get data from forntend
    //validate the data -is it empty or filed(can validate email formate)
    //check for duplicacy : is this email and username exist or not
    // checkt for images :avatar 
    //save imgae to local and upload itto cloudinary(check is it uploade and get limnk of it)
    //create db object
    //to send reponse frist remove the pasword and refreshtovken from response fiedld
    //check for user creatino
    //return rwesponnse'

    const {userName ,email,fullName,password}=req.body;
    // console.log("email: " ,email );

    //chck for values 

    if(
        [fullName,email,userName,password].some((field)=>
            field?.trim()==""
        )
        //some return true for array if any of satisfy this either false
    ){
        throw new ApiError(400,"all fieles are required")
        //if after triming a filed it return "" means that filed is emty and if ther
        // is any field satisfy this means there is problem 
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email address");
    }

    const userExist= User.findOne({
        $or :[{userName},{email}]
    })

    if(userExist){
        throw new ApiError(409,"user with this userName or email already exists")
    }

    //now check checking whether Multer received and processed the uploaded file
    //when multer processed  the files it add one more atribute to req called files

    const avatarLocalPath= req.files?.avatar[0]?.path;
    const coverLocalPath =req.files?.coverImage[0]?.path;

    if(avatarLocalPath){
        throw new ApiError(400,"avatar is required");
    }

    //uploade them to cloudinay

    const avatar = await cloudnary_file_upload(avatarLocalPath);
    const coverImage= await cloudnary_file_upload(coverLocalPath);

    if(!avatar){
        throw new ApiError(500,"avart is not uploaded");
    }

    //it return a object with info 
    console.log(avatar);

    //now create a database entry as we get the link of avatar and coverimga

    const user= await User.create({
        userName,
        email,
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url ||"",
    });

    //new check this is use is created or not by searching for object of id in 
    //also going to remove unrequired values for res from new valued return by db usign select

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    ) ;
    if(!createdUser){
        throw ApiError(500,"error while creating user object");
    }

    //if evrything is created and uploaded return response
    const finalResponse =new ApiResponse(200,createdUser);
    
    res.status(201).json(finalResponse);
});


const loginUser= asyncHandler(async(req,res,next)=>{
    //get data 
    // go with email or usernanme
    //find user
    // check password
    //if true -> access and token 
    //send cokie


    const {userName,password,email}=req.body;

    //is value enter or not
    if(!userName || !email){
        throw new ApiError(400,"email or userName is required");
    }

    //find user 
    const user=  await User.findOne(
        //we can pass just one values 
        {$or : [{ userName},{email}]}
    )

    //is user exists

    if(!user){
        throw new ApiError(404,"user not found")
    }

    //if exist then check password
    //function will run on object which is returned ->on user not on User

    const isPasswordValid= await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"invalid user credintails")
    }

    //token creation 
    //call function 

    const {accessToken,refreshToken}= await accessAndRefreshTokenGenerator(user._id);

    //sent cokkies -> where not sent password and refeshtoken 
    //so need user ->just update the curr user or one more to db to get new user after loged in
    //and by select method remove unwanted values like pass and refeshtoken
    const userLogedIn= await User.findById(user._id).select(
        "-password -refreshToken"
    );

    //to sent cokkies required  a option object define who can change them

    const options={
        httpOnly:true,
        secure:true
    }
    
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:userLogedIn,accessToken,refreshToken
            },
            "user is loged in successfully"
        )
    )
})

const logoutUser= asyncHandler(async(req,res)=>{

    //get user from req  and upoldate the freshtoken to undefined
    const userId=req.user._id;
    User.findByIdAndUpdate(
        userId,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    //now update the cookies

     const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,"user is loged out successfully")
    )
})


const refreshAccessToken= asyncHandler(async(req,res)=>{

    const incomingrefreshToken= req.cokkie.refreshToken || req.body.refreshToken;

    if(!incomingrefreshToken){
         throw new ApiError( 401,"unauthorized request ")
    }

        // now validate refresh token
    // refrsh token validate -> decoded refshtoken have id atleast -> seach in db
    // then -> add anther atribute user to the req
    // we can get 

    const decodeToken= await jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET);

    //now search in db

    try {const user= await User.findById(decodedToken?._id);

    if(!user){
        throw new ApiError("user not found as per token")
    }

    //if user found then check user refesh token and incoming refrsh token is same or not 

    
    if(incomingrefreshToken!==user.refreshToken){
        throw new ApiError(401,"refresh token is expired or used");
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    // now gernerate the new tokens
    const {accessToken,newRefreshToken}= await accessAndRefreshTokenGenerator(user._id);

    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refeshToken",newRefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken:newRefreshToken,
            },
            "access token is refreshed successfullu"
        )
    )}
    catch(eroror){
        new ApiError(401,error?.message||"unathorized user")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}