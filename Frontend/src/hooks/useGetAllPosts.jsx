import { setPosts } from '@/Redux/postSlice';
import { useEffect } from 'react'

import React from 'react';
import { useDispatch } from 'react-redux'

const useGetAllPosts = () => {
    // console.log("usegetallpost called")
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPosts = async () => {
            
            try {
                const res = await fetch(`${import.meta.env.VITE_URL}/api/v1/post/all`, {
                    method: "GET",
                    credentials: "include",

                })
                
                const data = await res.json()
                
                
                if (res.ok) {
                    dispatch((setPosts(data.posts)))
                    // console.log("data from post",data.posts)
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchAllPosts()

    }, [])
}
export default useGetAllPosts;