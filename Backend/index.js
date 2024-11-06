
import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connection from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import { app,server } from "./Socket/socket.js"


dotenv.config({})
// const app = express() ye wala app hata diya socket io wala import kiya he 
const port = process.env.PORT || 6000


// middlewares
// isliye use hota hai taaki Express app JSON format me jo data aata hai (usually POST requests se), usko automatically parse kar sake. Iske baad aap request body ko req.body me access kar sakte ho as a JavaScript object.
app.use(express.json())
// app.use(cors()) ka use hota hai taaki Cross-Origin Resource Sharing (CORS) ko enable kiya ja sake. Ye allow karta hai ki dusre domains se bhi API requests kiye ja sake, jo by default block hote hain.

// app.use(cookieParser()) isliye use hota hai taaki cookies ko parse karke easily req.cookies ke through access kiya ja sake.
app.use(cookieParser()) 

app.use(urlencoded({ extended: true }));

const corsOption={
    origin:process.env.URL,
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}
app.use(cors(corsOption))

// api aayengi yaha pe 
app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)

app.get("/", (req, res) => {
  res.send("Hello World!")
})


// yaha pe app.listen ki jagah server.listen karna he due to socket io 
server.listen(port, () => {
  connection()
  console.log(`Example app listening on port ${port}`)
})