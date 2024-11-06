/*
Route ek URL path hota hai jisme server decide karta hai ki agar user ne is URL pe request bheji to kya response dena hai.
Example: Agar user /home pe GET request karta hai, to server Home Page ka message return karega. like app.get post etc res.send ka use hota he

. Router kya hota hai?
Router ek tool hai jo multiple routes ko organize karne mein help karta hai. Jab tumhari app badi ho jaati hai, to saare routes ko ek jagah manage karna mushkil ho jata hai. Isliye hum alag-alag routers banate hain, jaise userRouter, postRouter, etc.
Router ek tarike ka group hota hai jo specific URLs ke liye routes handle karta hai.


Difference between React Router and Express Router:
React Router: Frontend pe hota hai, client-side routing ke liye. Iska kaam sirf yeh hota hai ki URL ke basis pe kaunsa React component render karna hai.
Express Router: Backend pe hota hai, server-side routing ke liye. Iska kaam request ko handle karna (jaise GET, POST, PUT) aur uska response dena hota hai.
Summary:
React Router DOM: Frontend (React) ke liye hota hai, jisse hum bina page reload kiye alag-alag components ko display karte hain based on URL.
Express Router: Backend (Node.js/Express) ke liye hota hai, jo request/response handle karta hai (jaise /register pe POST request handle karna).

*/


import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, register } from "../Controllers/userController.js";
import { logout } from "../Controllers/userController.js";
import { login } from "../Controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthentication.js";
import upload from "../middlewares/multer.js";


const router=express.Router();
// maltab jab register pe koi frontend se httpslocalhost :3000/register  pe requesst marega to ye  rotuer.route(/register)wala route callhoga? or phir post request ke through wo sara kaam karega jo register function me likha hoga  answer yes hoga
router.route('/register').post(register)
router.route('/logIn').post(login)
router.route('/logOut').get(logout)
router.route('/:id/profile').get(isAuthenticated,getProfile),
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePicture'),editProfile)
router.route("/suggested").get(isAuthenticated,getSuggestedUsers);
router.route('/followOrUnfollow/:id').post(isAuthenticated,followOrUnfollow)
export default router;
