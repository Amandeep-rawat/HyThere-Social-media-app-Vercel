import User from "../Models/userModels.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js";
import {post} from "../Models/postModels.js";
export const register = async (req, res) => {
    try {
        // console.log(req.body);
        const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "Something is a  missing ,please check again ", sucess: false,

            });

        };
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Invalid email format.",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists", sucess: false,
            });

        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ userName, email, password:hashedPassword });

        return res.status(200).json({ message: "User created successfully", sucess: true, });

    }
    catch (err) {
        console.log(err);
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);
        if (!email || !password) {
            return res.status(400).json({ message: "Something is missing ,please check again ", sucess: false, });

        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist", sucess: false, });

        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid Email or password", sucess: false, });
        }
        
        // console.log("setting token ")
        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
       //populate post here too
       const populatedPost=await Promise.all(
        user?.posts.map(async(postId)=>{
            const getPost=await post.findById(postId)
            // sirf logged in user ki post chiye 
            if(getPost?.author.equals(user._id)){
                
                return getPost;
            }
            return null;
        })
       )
        user={
            _id:user._id,
            userName:user.userName,
            email:user.email,
            gender:user.gender,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPost,
            bookmarks:user.bookmarks
            
        }
        return res.cookie("token", token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 }).status(200).json({ message: `Welcome ${user.userName}`,user, sucess: true, });
// res object pehle se hi Express ke through aata hai aur uske andar bohot saare methods hote hain, jaise res.send(), res.json(), res.status(), aur res.cookie().
    }
    catch (err) {
        console.log(err);
    }
}

export const logout = async (req, res) => {
    try {
        //  yaha pe browser se cookie ko remove kiya ja rha he . isse ye vi pta chll jaega ki kis user ko logout karna he kyuki uska token cookie me store hoga . har user ke browserme apna cookie hoga or logout karne ke liye
      return res.cookie("token","",{maxAge:0}).json({message:"Logged out succesfull",sucess:true})
    }
    catch (err) {
        console.log(err);
    }
}



/*
Token aur Cookie ka fayda:
Session Management: Jab user login karta hai, token ko cookie me save karna ek tarika hai user ko session me rakhne ka, bina server pe session store kiye.
Authentication: Har request me token server par jayega, jo verify karega ki request authenticated user ki hai ya nahi. Isse protected routes ko access karne me help milti hai.
Logout: Logout karte time token ko expire karke hum ensure karte hain ki agle request me user authenticate na ho.
Security: Cookies me token store karne ka fayda hai ki server-side security flags (like httpOnly, sameSite) laga ke hum token ko better secure kar sakte hain.
*/

export const getProfile = async (req, res) => {
    try {
    const userId=req.params.id;
  

    let user = await User.findById(userId)
    .select("-password")
    .populate({ path: "posts", options: { sort: { createdAt: -1 } } }) // Sorting posts
    .populate({ path: "bookmarks" }); // Populate bookmarks
    // console.log("you are here",user);
    
        if(!user){
            return res.status(404).json({message:"User not found",sucess:false})
        }
        return res.status(200).json({
            user,
            sucess:true
        })
    }
    catch (err) {
        console.log(err);
    }
}
export const editProfile = async (req, res) => {
    try {

        // yaha pe wait middleware folder banao uske andr kaam h. edit karne ke liye pata hona chiye ki apni hi profile edit karni he to hame pata he hamari user id token ke andr store he to wahi kaam he 
        const userId=req.id;
        // console.log("userid is ",userId);
        const {bio,gender}=req.body;
        const profilePicture=req.file;
        let cloudResponse;
        if(profilePicture){
            const fileUri=getDataUri(profilePicture);
            cloudResponse=await cloudinary.uploader.upload(fileUri);

        }

        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found",sucess:false})
        }
        if(bio){
            user.bio=bio;
        }
        if(gender){
            user.gender=gender;

        }
        if(profilePicture){
            user.profilePicture=cloudResponse.secure_url

        }
        await user.save();
        return res.status(200).json({
            message:"Profile updated successfully",
            user,
            sucess:true
        })
    }

    catch(err){
        console.log(err);
    }
}
export const getSuggestedUsers = async (req, res) => {
try{
    // selecting those id that is not equal to req.id and deselecting password field
const suggestedUsers=await User.find({_id:{$ne:req.id}}).select("-password");
if(!suggestedUsers){
    return res.status(404).json({message:"No suggested users found",sucess:false})
}
return res.status(200).json({users:suggestedUsers,sucess:true})
}
catch(error){
console.log(error)
}
};


export const followOrUnfollow=async(req,res)=>{
    // console.log("follow or unfollow called");
    try{

        const followKarneWala=req.id;
        // console.log(followKarneWala)
        const jiskoFollowKaruga=req.params.id;
        // console.log(jiskoFollowKaruga)
        if(followKarneWala==jiskoFollowKaruga){
            return res.status(400).json({message:"You can't follow/unfollow yourself",sucess:false})
        }
        const user=await User.findById(followKarneWala)
        // console.log(user)
    
        const targetUser=await User.findById(jiskoFollowKaruga)
        if(!user || !targetUser){
            return res.status(404).json({message:"User not found",sucess:false})
        }


        // check karna he ab ki follow karna he ya unfoolloow karna he 
        // if follow karna he
        const isFollowing=user.following.includes(jiskoFollowKaruga)
        if(isFollowing){
            // remove karna ya unfollow karne he
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$pull:{following:jiskoFollowKaruga}}),
                User.updateOne({_id:jiskoFollowKaruga},{$pull:{followers:followKarneWala}}),
            ])
            return res.status(200).json({message:"Unfollowed successfully",sucess:true})
        }
        else{

            //foollow logic 
            // promise.all ka use isliye kiya he kyunki 1 hi 2 document field update karna he
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$push:{following:jiskoFollowKaruga}}),
                User.updateOne({_id:jiskoFollowKaruga},{$push:{followers:followKarneWala}}),
            ])
            return res.status(200).json({message:"Followed successfully",sucess:true})
        }
    }

    catch(error){

    }
}