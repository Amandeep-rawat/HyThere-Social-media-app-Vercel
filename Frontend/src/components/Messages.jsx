import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { NavLink } from 'react-router-dom'
import { Button } from './ui/button'
import useGetAllMessages from '@/hooks/useGetAllMessages'
import useGetRealTimeMessage from '@/hooks/useGetRealTimeMessage'
import { useRef } from 'react'
import { useEffect } from 'react'
const Messages =React.memo(({messages}) => {

    const messagesEndRef = useRef(null);

    useGetRealTimeMessage();
    useGetAllMessages();
    const {selectedUser}=useSelector((state)=>state.auth)

// const {messages}=useSelector((state)=>state.chat)
const {user}=useSelector((state)=>state.auth)
// console.log("messsages are here ", messages)


 // Scroll to the latest message instantly when component mounts or when messages change
 useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);
    
  return (
    <div className='overflow-y-auto flex-1 p-4'>
        <div className='flex justify-center'>
            <div className='flex flex-col items-center justify-center'>

            <Avatar className="h-20 w-20">
                <AvatarImage src={selectedUser?.profilePicture}/>
                <AvatarFallback>🥹</AvatarFallback>
            </Avatar>
            <span>{selectedUser?.userName}</span>
            <NavLink to={`/profile/${selectedUser?._id}`}><Button variant="secondary" className="h-8 my-2 ">View Profile</Button></NavLink>
            </div>


        </div>
        <div className='flex flex-col gap-3'>
            {

              messages &&  messages?.map((msg)=>{
                    return (
                        <div key={msg?._id} className={`flex ${msg?.sender_id===user?._id ? "justify-end" : "justify-start"}`}>
                            <div className= {`p-2 rounded-lg max-w-xs break-words ${msg?.sender_id===user?._id  ? 'bg-blue-500 text-white':'bg-gray-200 text-black '  }   `} >

                            {msg?.message}
                            </div>
                        </div>
                    )
                    
                })
            }
            <div ref={messagesEndRef} />
        </div>

    </div>
  )
}
)
export default Messages;