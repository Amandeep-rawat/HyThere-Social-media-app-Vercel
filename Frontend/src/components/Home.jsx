import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import Feed from './Feed'
import useGetAllPosts from "../hooks/useGetAllPosts"
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
// import CommentDialog from './CommentDialog'

const Home = () => {
 
  useGetSuggestedUsers();
  useGetAllPosts();
    
  
  
  return (
    <div className='flex'>
      {/* jitna extra space hoga conatiener me flex grow 1 karne se  wo le lega  */}
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
       </div>
      <RightSidebar/>
    </div>
  )
}

export default Home