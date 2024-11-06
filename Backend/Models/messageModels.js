import mongoose from "mongoose"
const messageSchema=mongoose.Schema({
    sender_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    receiver_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    message:{type:String,required:true}
})
const message=mongoose.model('message',messageSchema)
export default message;