import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique:false  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  gender: { type: String, enum: ["male", "female", "other"] },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  //note: mongoose.schema.types ka maltb he ki ye documents ki object id wale type ki values ko store karega. ab wo value kisi specific format me nhi hoti like string int etc. wo hexadecimal type ki hotihe . isliye type wo wala set kiya he . lekin abhi ye nhi bataya he ki kis document ki id store hogi . 
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],

}, { timestamps: true })
const User = mongoose.model('User', userSchema);
export default User;
