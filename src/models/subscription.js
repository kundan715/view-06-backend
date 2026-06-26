import mongoose, {Schema} from "mongoose"

const subcriptionSchema =  new Schema({
    subscriber: {
        type:Schema.Types.ObjectId,//who is subcribing 
        ref:"User"
    },
    channel :{
        type: Schema.Types.ObjectId,//whom  subscribing
        ref:"User"
    }
}, {timestapms:true})

export  const Subcription = new mongoose.model("Subscription",subcriptionSchema)