import React from 'react'
import Post from './Post'


import { useSelector } from 'react-redux'
import store from '@/Redux/store'
import { Loader2 } from 'lucide-react'
const Posts = () => {
  let {posts}=useSelector((state)=>state.post)
  // console.log("post state changed in redux",posts)
  // const reversePosts=[...posts].reverse()

  
  return (
    posts?(

      <div>
        {
          
          posts.map((post,index)=>{
            return(
              <Post key={post._id} post={post}/>
            )
            
          })
}
    </div>
        ):
        (

          <div className='flex items-center justify-center'>
            <Loader2 size={40} className='w-10 h-10 animate-spin'/>
          </div>
        )
  )
}

export default Posts