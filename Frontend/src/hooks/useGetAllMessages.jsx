import { setMessages } from '@/Redux/chatSlice';
import { setPosts } from '@/Redux/postSlice';
import { useEffect } from 'react'

import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

const useGetAllMessages = () => {
    // console.log("usegetallmessages called")
    const dispatch = useDispatch();
    const {selectedUser}=useSelector((state)=>state.auth)
    useEffect(() => {
        // console.log("called")
        const fetchAllMessages = async () => {
            
            try {
                const res = await fetch(`${import.meta.env.VITE_URL}/api/v1/message/all/${selectedUser?._id}`, {
                    method: "GET",
                    credentials: "include",

                })
                
                const data = await res.json()
                
                // console.log("data messages aare ",data.messages)
                if (res.ok) {
                    dispatch(setMessages(data.messages))
                    // console.log("data from post",data.posts)
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchAllMessages()

    }, [selectedUser])
}
export default useGetAllMessages;