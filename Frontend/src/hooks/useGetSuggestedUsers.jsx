import { setSuggestedUsers } from '@/Redux/authSlice';
import { setPosts } from '@/Redux/postSlice';
import { useEffect } from 'react'

import React from 'react';
import { useDispatch } from 'react-redux'

const useGetSuggestedUsers = () => {
    // console.log("usegetallpost called")
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            
            try {
                const res = await fetch(`${import.meta.env.VITE_URL}/api/v1/user/suggested`, {
                    method: "GET",
                    credentials: "include",

                })
                
                const data = await res.json()
                
                
                if (res.ok) {
                    dispatch((setSuggestedUsers(data?.users)))
                    // console.log(data)
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchSuggestedUsers()

    }, [])
}
export default useGetSuggestedUsers;