import mongoose ,{Schema} from "mongoose"
//import pluginate agregate library
import mongooseAggregatePaginate  from "mongoose-aggregate-paginate-v2";

const videoSchema= new Schema({
    videoFile:{
        type:String,
        required:true
    },
    tumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});


videoSchema.plugin(mongooseAggregatePaginate);

export  const Video= mongoose.model("Video",videoSchema);

//agrregates paginates is a library to plugin some extra feature search ele in mongooose
