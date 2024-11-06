import User from "../Models/userModels.js";
import sharp from "sharp"
import {post} from "../Models/postModels.js";

import comment from "../Models/commentModels.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId,io } from "../Socket/socket.js";


export const addNewPost=async(req,res)=>{
try {
    const {caption}=req.body;
    const image=req.file;
    const authorId=req.id;
    if(!image){
        return res.status(400).json({message:"image is required",sucess:false});

    }
    // optimization for reducing high quality image 
    const optimizedImageBuffer=await sharp(image.buffer).resize({width:800,height:800,fit:"inside"}).toFormat('jpeg',{quality:80}).toBuffer();
    // yaha pe getdatauri isliye use nhi kiya kyuki image optimise ki thi or optimise imge ko niche wale code se hi base 64 me convert kiya he . lekin proifile upload wale me getdartauri ka use karke base64 me convet kiya he taki cloudinary pe uplaod kiyaja sakte. same yyaha but foroptimisze image . 
    const fileUri=`data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse=await cloudinary.uploader.upload(fileUri);
    const newPost=await post.create({caption,image:cloudResponse.secure_url,author:authorId});
    const user=await User.findById(authorId);
    if(user){
        user.posts.push(newPost._id);
        await user.save();
    }
    if(!user){
        return res.status(404).json({message:"User not found",sucess:false});
    }
    /*
    path: "author": Yeh specify karta hai ki author field ko populate karna hai. Matlab author field mein sirf user ka ID stored hoga, lekin populate() se wo complete user object ban jayega, jaise ki name, email, etc., but not just the ID.

    select: "-password": Iska matlab yeh hai ki user ka password field exclude kiya jayega, kyunki sensitive data hamesha hidden rakhna chahiye. Yeh sirf wo fields laata hai jo aapko dikhane hain.

    Why use populate() here?
Jab ek post create hota hai, author ka sirf ID store hota hai Post document mein. Agar aapko user ke details bhi chahiye (like name, email) post ke saath, to populate() author ke details ko retrieve karega based on user ka ID, jo post ke saath associated hai. Is se aapko full information mil jaati hai bina manually query karne ke.
    */

    await newPost.populate({path:"author",select:"-password"});
    return res.status(200).json({
        message:"Post created successfully",
        sucess:true,
        post:newPost
    }) 
} catch (error) {
    console.log(error);
    return res.status(500).json({message:error.message,sucess:false})
}
}


// get all post 
export const getAllPost=async(req,res)=>{
    try {
        // ham multiple users ki post ko rhe he or populate isliye kiya  taki unka username and prifilepicture vi mil jae 

        /*

        Haan, exactly! Jaise hi tum populate( path "author") likhte ho, Mongoose post schema ke author field ko check karta hai, jo ek reference (ref: "User") hota hai. Phir Mongoose User schema mein jaake us author ki details fetch karta hai.

Aur jab tum select: "userName profilePicture" likhte ho, to sirf wahi fields (userName aur profilePicture) user schema se fetch ki jati hain, jo tum specify karte ho, instead of fetching the entire user document.
        */
        const posts = await post.find()
    .sort({ createdAt: -1 })
    .populate({ 
        path: "author", 
        select: "userName profilePicture" 
    }).populate({
        path:"comments",
        sort:{createdAt:-1},
        populate:{ //yaha pe nested populate isliye use kiya kyuki jab hamne path:comments ko populate kiya to wo comments wali field comment schema ko point kar rhi thi lekin comment schema ke andr jo author tha wo sirf 1 id thi . lekin hame id ki full details vi chiye thi isliye uske andr gye 
            path:"author",
            select:"userName profilePicture"
        }
    });
    // console.log("posts from databse are ",posts)
    return res.status(200).json({message:"Posts fetched successfully",sucess:true,posts:posts});

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message,sucess:false})
    }
}

export const getUserPosts=async(req,res)=>{
    try {
        const authorId=req.id;
        const posts=await post.find({author:authorId}).sort({createdAt:-1}).populate({path:"author",select:"userName profilePicture"})
        .populate({path:"comments",populate:{path:"author",select:"userName profilePicture"}})
        return res.status(200).json({posts,sucess:true,message:" single user posts fetched successfully"})
    }
     catch (error) {
        console.log(error)
        res.status(500).json({message:error.message,sucess:false})
        
    }
}
export const likePost=async(req,res)=>{
try {
    const likeKarneWalaUserId=req.id;
    const postId=req.params.id;
    console.log(postId)
    const getPost=await post.findById(postId);
    if(!getPost){
        return res.status(404).json({message:"Post not found",sucess:false});
    
    }
    await getPost.updateOne({$addToSet:{likes:likeKarneWalaUserId}});
    // yaha pe push use isliye nhi kiya kyuki 1 hi user warna baar abaar like kar deta . aur as we know mongodb me redudeny hota he . 
    // await post.save(); not needed with updateone and addtoset


    // implementing socket io for real time notification later.................
    const user=await User.findById(likeKarneWalaUserId).select('userName profilePicture');
    const postOwnerId=getPost.author.toString();

    if(postOwnerId!==likeKarneWalaUserId){
        // emit notifcation

        const notification={
            type:"like",
            userId:likeKarneWalaUserId,
            userDetails:user,
            postId,
            message:`${user.userName} liked your post`
        }
        const postOwnerSocketId=getReceiverSocketId(postOwnerId);

        if(postOwnerSocketId){
            io.to(postOwnerSocketId).emit("notification",notification);
        }
    }
    
    return res.status(200).json({message:"Post liked successfully",sucess:true})


} catch (error) {
    console.log(error)
    res.status(500).json({message:error.message,sucess:false})
}
}
export const dislikePost=async(req,res)=>{
try {
    const likeKarneWalaUserId=req.id;
    const postId=req.params.id;
    const getPost=await post.findById(postId);
    if(!getPost){
        return res.status(404).json({message:"Post not found",sucess:false});
    
    }
    await getPost.updateOne({$pull:{likes:likeKarneWalaUserId}});
    // yaha pe push use isliye nhi kiya kyuki 1 hi user warna baar abaar like kar deta . aur as we know mongodb me redudeny hota he . 
    // await post.save();
    // implementing socket io for real time notification later.................
// implementing socket io for real time notification later.................
const user=await User.findById(likeKarneWalaUserId).select('userName profilePicture');
const postOwnerId=getPost.author.toString();

if(postOwnerId!==likeKarneWalaUserId){
    // emit notifcation

    const notification={
        type:"dislike",
        userId:likeKarneWalaUserId,
        userDetails:user,
        postId,
        message:`${user.userName} disliked your post`
    }
    const postOwnerSocketId=getReceiverSocketId(postOwnerId);

    if(postOwnerSocketId){
        io.to(postOwnerSocketId).emit("notification",notification);
    }
}

    return res.status(200).json({message:"Post disliked successfully",sucess:true})

} catch (error) {
    console.log(error)
    res.status(500).json({message:error.message,sucess:false})
}
}

export const addComment=async(req,res)=>{
    try {
        console.log("comment adding ..")
        const postId=req.params.id;
        const commentKarneWalaUser=req.id;
        const {text}=req.body;
        const getPost=await post.findById(postId);
        if(!text){
        return res.status(400).json({message:"text is required",sucess:false});
        }
        const getComment=await comment.create({text,author:commentKarneWalaUser,post:postId});
        
        console.log("getcomment",getComment);

        await getComment.populate({path:"author",select:"userName profilePicture"});
        getPost.comments.push(getComment._id);
        await getPost.save();
        return res.status(200).json({message:"Comment added successfully",sucess:true,comment:getComment})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message,sucess:false})
    }
};

export const getCommentOfPost=async(req,res)=>{
    try{
        const postId=req.params.id;
        const comments=await comment.find({post:postId}).populate({path:"author",select:"userName profilePicture"});
        if(!comments)
        {
            return res.status(404).json({message:"Comments not found for the post",sucess:false});
        }
        return res.status(200).json({message:"Comments fetched successfully",sucess:true,comments:comments})
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message,sucess:false})
    }
}

export const deletePost=async(req,res)=>{
    try{
        const postId=req.params.id;
        const getPost=await post.findById(postId);
        if(!getPost){
            return res.status(404).json({message:"Post not found",sucess:false});
        }
        if(getPost.author.toString()!=req.id){
            return res.status(403).json({message:"You are not authorized to delete this post",sucess:false});
        }
        await post.findByIdAndDelete(postId);
        
        //remove the postId from users;
        let user=await User.findById(req.id);
        user.posts=user.posts.filter((id)=>id.toString()!=postId);

        //remove associated comments of this post ;
        await comment.deleteMany({post:postId});

        await user.save();
        return res.status(200).json({message:"Post deleted successfully",sucess:true});
    }

    catch(error){
        console.log(error);
    }
}

export const bookmarkPost=async(req,res)=>{
    const authorId=req.id;
    const postId=req.params.id;
    const user=await User.findById(authorId);// document retrive karna bolte he ise . we can use simple push pull with it 
    const getPost=await post.findById(postId);
    if(!getPost){
        return res.status(404).json({message:"Post not found",sucess:false});
    }
    //unbookmark logic;
    if(user.bookmarks.includes(postId)){
//         Direct push()/pull(): Aap document pehle se retrieve karte ho, uske baad manually array ko modify karke save() karte ho.
// $push/$pull with updateOne(): Aap directly database mein query ke through array ko modify karte ho, bina document ko retrieve kiye.
// diffrence

// with simple push pull
// const user = await User.findById(req.id); // Document ko retrieve kiya
// user.bookmarks.push(postId); // Array ko modify kiya
// await user.save(); // Changes ko database mein save kiya

// with updateOne
// await User.updateOne({ _id: req.id }, { $push: { bookmarks: postId } }); // Directly database mein update kiya


        await user.bookmarks.pull(postId);
        await user.save();
        return res.status(200).json({message:"Post unbookmarked successfully",sucess:true});
    }
    else{
        //this approach also good . we can also use $push and $pull with updateOne
        await User.updateOne({_id:authorId},{$push:{bookmarks:postId}});
        return res.status(200).json({message:"Post bookmarked successfully",sucess:true});
    }

}