import{ asyncHandler} from "../utils/asyncHandlerFun.js"
import  {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {cloudnary_file_upload} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

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
        throw ApiError(400,"all fieles are required")
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
        throw ApiError(400,"avatar is required");
    }

    //uploade them to cloudinay

    const avatar = await cloudnary_file_upload(avatarLocalPath);
    const coverImage= await cloudnary_file_upload(coverLocalPath);

    if(!avatar){
        throw ApiError(500,"avart is not uploaded");
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

export {registerUser}