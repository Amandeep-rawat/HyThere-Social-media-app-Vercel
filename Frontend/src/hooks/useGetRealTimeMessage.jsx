import { setMessages } from '@/Redux/chatSlice';
import { useEffect } from 'react'

import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

const useGetRealTimeMessage = () => {
    // console.log("usegetrealtimemessages called")
    const dispatch = useDispatch();
    const {socket}=useSelector((state)=>state.socketIo)
    const {messages}=useSelector((state)=>state.chat)
    

    useEffect(() => {
        // console.log("called")
    socket?.on('newMessage',(newMessage)=>{
        dispatch(setMessages([...messages,newMessage]))

    })
    

    return ()=>{
        socket?.off(('newMessage'));
    }

    }, [messages,setMessages])
}
export default useGetRealTimeMessage;