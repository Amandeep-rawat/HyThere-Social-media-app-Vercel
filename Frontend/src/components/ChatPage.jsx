import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setSelectedUser } from '@/Redux/authSlice'
import { Button } from './ui/button'
import { ArrowBigLeft, ArrowLeft, MessageCircle, MessageCircleCode } from 'lucide-react'
import Messages from './Messages'
import { setMessages } from '@/Redux/chatSlice'
import { toast } from 'sonner'

import { Loader2 } from 'lucide-react'
const ChatPage = () => {
    const {user,suggestedUsers,selectedUser}=useSelector((state)=>state.auth)
    
    
    // console.log("suggested users",suggestedUsers)
    const dispatch=useDispatch();
    const {onlineUsers,messages}=useSelector((state)=>state.chat)
    const [textMessage,setTextMessage]=useState("")
    // const {messages}=useSelector((state)=>state.chat)
    const [sending,setSending]= useState(false);


    const sendMessageHandler=async()=>{
    try {
        setSending(true)
        // console.log("sendmessage handler called")
        const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/message/send/${selectedUser?._id}`,{
            method:"POST",
            credentials:"include",
            body:JSON.stringify({message:textMessage}),
            headers:{
                "Content-Type":"application/json"
            }
        })
        // console.log("response is ",res );
        const data= await res.json();
        if(res.ok)
            {   
            setSending(false)
            // console.log("hello")
            const updatedmessage=[...messages,data.newMessage.message]
            // console.log("upatedmeeage is ",updatedmessage)
            dispatch(setMessages([...messages,data.newMessage]))
            // console.log("data is ",data);
            setTextMessage("")
            toast.success("sent successfully")
        }
    } catch (error) {
        console.log(error)
    }finally{
        setSending(false)
        
    }

    }
    //clean up when user leave chat section so meessage icon shown 
    useEffect(()=>{
        return ()=>{
            dispatch(setSelectedUser(null))
        }
    },[])
    return (
    
    <div className='flex ml-[16%] max-[1150px]:ml-[24%]  max-[900px]:ml-[14%] max-[800px]:ml-[18%] max-sm:ml-[22%]  h-screen'>
        
        <section className={`lg:w-1/4 ${selectedUser ? "hidden":"block"} max-sm:w-full max-lg:w-1/3 max-md:w-1/2 max-sm:my-3 my-8`}>

        <h1 className="font-bold max-sm:text-center mb-4 px-3 text-xl">{user?.userName}</h1>
        
        <hr  className='mb-4 border-gray-300'/>
        <div className="overflow-y-auto h-[80vh]">
            {
                
                    suggestedUsers?.map((suggestedUser) => {
                        let isOnline=onlineUsers?.includes(suggestedUser?._id);

                        return(
                            <div onClick={()=>{
                                dispatch(setSelectedUser(suggestedUser))
                            }} key={suggestedUser?._id} className='flex gap-3 items-center p-3 cursor-pointer hover:bg-gray-50'>
                                    <Avatar className="w-14 h-14">
                                        <AvatarImage src={suggestedUser?.profilePicture}/>
                                        <AvatarFallback>CN</AvatarFallback>

                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.userName}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600':'text-red-600'}` }>{isOnline ? "Onlilne" : "Offline"}</span>
                                    </div>
                                </div>
                        )
                    })
                }

        </div>
                </section>
                {
                    selectedUser?
                    (

                        <section className='flex-1  border-l border-l-gray-300 flex flex-col h-full'>
                            <div className='flex gap-3 justify-between items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            
                            <ArrowLeft onClick={()=>{
                                dispatch(setSelectedUser(null))
                            }}/>
                             <div className='flex gap-3 items-center'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture}/>
                                <AvatarFallback>🥹</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>

                            <span>{selectedUser?.userName}</span>
                            </div>
                                </div>

                                   
                            </div>
                            <Messages messages={messages}/>
                            {/* messages */}
                            <div className='flex items-center p-4 border-t-gray-300 border-t'>
                                <input style={{outline:"none"}} type="text" value={textMessage} onChange={(e)=>{
                                    setTextMessage(e.target.value)
                                }} className='flex-1 mr-2 focus-visible:ring-transparent 'placeholder='Messages...' />
                                
                                {
                                    sending==="true"?
                                    <Button><Loader2 className='w-4 h-4 animate-spin'/></Button>
                                    :

                                <Button onClick={sendMessageHandler}>Send</Button>
                                }

                            </div>
                        </section>

                    ):(
                        <div className='flex flex-col items-center max-sm:hidden justify-center mx-auto'>
                            <MessageCircleCode className='w-32 h-32 my-4'/>
                            <h1 className='font-medium  text-xl'> Your messages...</h1>
                            <span>Send a message to start a chat</span>
                        </div>
                    )
                }
                
    </div>
  )
}

export default ChatPage