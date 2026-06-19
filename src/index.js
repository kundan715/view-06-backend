import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import connectToDb from "./db/index.js";

dotenv.config();

connectToDb();


/*

const app = express();

(async()=>{
    try{
        await mongoose.connect(process.env.monogodb_url+DB_NAME);
        console.log("connected to db");

        app.on("error",(error)=>{
            console.error("error connecting to db", error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`server started on port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.error("error connecting to db", error);
    }
})()


first is function  creation and
then we are calling it immediately after defining it. This is called IIFE (Immediately Invoked Function Expression).
*/