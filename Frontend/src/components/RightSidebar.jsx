import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector((state) => state.auth)
  return (
    <div className=' max-lg:hidden my-10  w-fit  pr-20 '>

    <div className='flex items-center gap-2'>
      <Link to={`/profile/${user?._id}`}>


      <Avatar>
        <AvatarImage src={user?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      </Link>


      <div className="">
        <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.userName}</Link></h1>
        <span className='text-gray-600 text-sm'>{'Bio here'}</span>
      </div>
    </div>

    {/* ssuggested users */}
    <SuggestedUsers/>  
    </div>
  )
}

export default RightSidebar