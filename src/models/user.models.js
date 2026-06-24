import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
 

//jwt is a beirer token >>who have this token are allowed


const userSchema= new Schema(
    {
        userName:{
            type:String,
            required:true,
            uique:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            uique:true,
            trim:true
        },
        fullName:{
            type:String,
            required:true,
            index:true
        },
        avtar:{
            type:String,
            required:true
        },
        coverImage:{
            type:String//cloud url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"password is required"]
        },
        refreshToken:{
            type:String
        }

    },
    {timestamps:true}
);

//pre is middle ware (require a next statement)which is use to perfrom a task before some act 
// here we want pasword to be encrypt before save so..
userSchema.pre("save", async function(next){
    if(!this.isModified("password"))next();
    this.password= bcrypt.hash(this.password,10);
    next();
});



userSchema.methods.isPasswordCorrect= async function(password){

   return  await bcrypt.compare(password,this.password);

}

// a token generator fuction

userSchema.methods.accessTokenGenerator= function(){
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
        
    )
}

userSchema.methods.refreshTokenGenerator= function(){
    jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
        
    )
}

export const User= mongoose.model("User",userSchema);

