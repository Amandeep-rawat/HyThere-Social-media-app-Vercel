import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setAuthUser, setSelectedUser, setSuggestedUsers, setUserProfile } from '@/Redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/Redux/postSlice'
import { setMessages, setOnlineUsers } from '@/Redux/chatSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { setSocket } from '@/Redux/socketSlice'
import { resetNotifications, setLikeNotification } from '@/Redux/RTnotification'


const LeftSidebar = () => {
    const {user}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();

    const navigate=useNavigate();
    const [open,setOpen]=useState(false);
    const {likeNotification}=useSelector((state)=>state.realTimeNotification);
    const {msgNotifications}=useSelector((state)=>state.chat);
    const sidebarItems=[
        {icon:<Home/>,text:"Home"},
        {icon:<Search/>,text:"Search"},
        {icon:<TrendingUp/>,text:"Explore"},
        {icon:<MessageCircle/>,text:"Messages"},
        {icon:<Heart/>,text:"Notifications"},
        {icon:<PlusSquare/>,text:"Create"},
        {icon:<Avatar className="w-6 h-6">
            <AvatarImage src={user?.profilePicture} />
            {/* note: abhi profilepicture to set hoga lekin page refresh pe gayab ho jata he i dont know why . thats why we using redux-persist and paste some import statement and code in store.js */}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          ,text:"Profile"},
        {icon:<LogOut/>,text:"LogOut"},
]

const [activeItem, setActiveItem] = useState("Home"); // Set default to "Home" or whatever you prefer

// logout button click 
const logOutHandler= async ()=>{
    try {
        
        const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/user/logOut`,{
            method:"GET",
        })
        const data=await res.json();
        
        if(res.ok){
            dispatch(setAuthUser(null));
            dispatch(setPosts([]));
            dispatch(setSelectedPost(null));
            dispatch(setMessages([]));
            dispatch(setOnlineUsers([]));
            dispatch(setSocket(null));
            dispatch(setSelectedUser([]))
            // dispatch(setLikeNotification([]));
            dispatch(resetNotifications([]));
            dispatch(setSuggestedUsers([]));
            dispatch(setUserProfile(null));
            navigate("/login");
            
            toast.success(data.message)

        }
        else {
            // Handle cases where res.ok is false (non-200 responses)
            
            toast.error(data.message || "Logout failed");
        }
    } catch (error) {
        toast.error(error.message)
    }
}

const sidebarHandler=(textType)=>{
    setActiveItem(textType);
if(textType=="LogOut"){
    logOutHandler()
}
else if(textType=="Create"){
setOpen(true);
}
else if(textType=="Profile"){
    navigate(`/profile/${user?._id}`)
}
else if(textType=="Home"){
    navigate(`/`)
}
else if(textType=="Messages"){
    navigate(`/chat`)
}
else if(textType=="Search"){
    alert("Working on Search and Explore page... you can visit Message , Profile,Create Post Etc")
}
else if(textType=="Explore"){
    alert("Working on Search and Explore page... you can visit Message , Profile,Create Post Etc")
}

}
  return (
    <div className=' max-[1150px]:w-[20%]   max-[900px]:w-fit  fixed top-0 z-10 left-0 px-4 max-[430px]:px-1 border-r border-gray-300  h-screen'>
       
       <div className='flex h-full  flex-col'>
        <h1 className='my-8 max-[460px]:my-5  pl-3 max-[900px]:pl-0 font-bold text-xl max-[470px]:font-semibold max-[470px]:text-base '>HyThere</h1>
        <div className='flex h-full flex-col justify-between  '>


           {
               sidebarItems.map((item,index)=>{

                const isActive = item.text === activeItem;
                   return(
                       <div onClick={()=>sidebarHandler(item.text)} className={`flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 ${isActive ? 'bg-gray-300' : ''}`} key={index}>
                        {item.icon}
                        <span className='max-[900px]:hidden' >{item.text}</span>
                        {
                            item.text==="Notifications" && likeNotification.length>0 ?
                          <Popover>
                            <PopoverTrigger asChild>
                                   

                                    <Button className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-800 absolute bottom-6 left-6" size="icon">
                                        {likeNotification.length}
                                    </Button>
                                            </PopoverTrigger>
                                    
                                    <PopoverContent>
                                        <div>
                                            {
                                                likeNotification.length==0 ?(
                                                    <p>No new notifications</p>
                                                ): likeNotification.map((notification)=>{
                                                    return(
                                                        <div className='flex items-center gap-2' key={notification?._id}>
                                                            <Avatar>
                                                                <AvatarImage src={notification?.userDetails?.profilePicture} />
                                                                <AvatarFallback>CN</AvatarFallback>

                                                            </Avatar>
                                                            <p className='text-sm '> <span className='font-semibold' >{notification?.userDetails?.userName}</span> Liked your post</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <Button onClick={()=>{
                                                dispatch(resetNotifications([]))
                                            }} variant= 'ghost' className=" mx-auto w-full font-semibold text-red-500 mt-4">Clear all</Button>
                                        </div>
                                    </PopoverContent>
                                
                          </Popover>
                          
                            :null
                        }




                    </div>
                )
            })
        }
        </div>
            </div> 
            
        <CreatePost open={open} setOpen={setOpen}/>
    </div>
  )
}

export default LeftSidebar