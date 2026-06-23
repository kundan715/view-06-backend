import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config (
    {cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_KEY,
    api_secret:process.env.CLOUDINARY_CLOUD_SECRET
}
)

const cloudnary_file_upload =  async function(localFilePath){
    try{if(!localFilePath)return null;

    const reponse= await cloudinary.uploader.upload(localFilePath,{
        resource_type:auto
    })

        if(response){
            console.log("file is uploaded successfully",response.url);
        }
    return response
    }
    catch(error){
        console.log("internal error occured",error);
        return null;
    }
    finally{
        fs.unlinkSync(localFilePath);
    }
}
