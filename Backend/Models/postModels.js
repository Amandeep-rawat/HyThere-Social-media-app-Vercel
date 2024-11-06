import mongoose from "mongoose";
const postSchema=new mongoose.Schema({
    caption:{type:String,default:""},
    image:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"comment"}],
    createdAt: { type: Date, default: Date.now }, 
});
export const post=mongoose.model('post',postSchema);