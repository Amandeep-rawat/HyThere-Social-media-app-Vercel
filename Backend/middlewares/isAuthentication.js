import jwt from "jsonwebtoken"

// this function used for checking user log in or not or we can say token he ya nhi cookie me check karne ke liye ya aunthenitcated he ya nhi check karne ke liye

const isAuthenticated = async (req, res, next) => {
    console.log("aunthenicated middleware called ");
    try{
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({message:"Please login first.user is not authenticated",sucess:false})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        /*

decoded object me wo data hota hai jo JWT (JSON Web Token) me encoded hota hai. Jab aap token ko decode ya verify karte ho using jwt.verify(), to aapko wo data wapas milta hai jo aapne token create karte waqt usme daala tha.
        */

        if(!decoded){
            return res.status(401).json({message:"invalid",sucess:false})
        }

/*

req.body – Request body ka data (POST/PUT requests).
req.query – URL ke query parameters.
req.params – URL ke route parameters.
req.headers – Client ke request headers.
req.cookies – Client ke cookies (if cookie-parser use ho).
req.method – HTTP method (GET, POST, etc.).
req.url – Requested URL ka path.
req.ip – Client ka IP address.
*/


        req.id=decoded.id;
        
        next()

    }
    catch(err){
        console.log(err)
    }
}
export default isAuthenticated