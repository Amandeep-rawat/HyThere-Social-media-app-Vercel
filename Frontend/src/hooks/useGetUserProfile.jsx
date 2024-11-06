import { setSuggestedUsers, setUserProfile } from '@/Redux/authSlice';
import { setPosts } from '@/Redux/postSlice';
import { useEffect } from 'react'

import React from 'react';
import { useDispatch } from 'react-redux'


const useGetUserProfile = (userId) => {
// console.log("usreid",userId)
    // console.log("usegetallpost called")
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            
            try {
                const res = await fetch(`${import.meta.env.VITE_URL}/api/v1/user/${userId}/profile`, {
                    method: "GET",
                    credentials: "include",

                })
                
                const data = await res.json()
                
                
                
                if (res.ok) {
                    dispatch((setUserProfile(data?.user)))
                    // console.log("user from usegetuserprofile",data?.user)
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchUserProfile()

    }, [userId])
}
export default useGetUserProfile;