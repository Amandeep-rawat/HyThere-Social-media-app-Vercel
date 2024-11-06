import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector((state) => state.auth)
    // console.log("suggested users are ",suggestedUsers)
    return (

        <div className="my-10">
            <div className='flex items-center justify-between text-sm gap-6'>
                <h1 className='font-semibold text-gray-600'>Suggested for you </h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {

                suggestedUsers?.map((user) => {
                    return (
                        <div key={user?._id} className='flex  items-center my-5 justify-between'>

                            <div className='flex items-center gap-2'>
                               


                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                               


                                <div className="">
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.userName}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{'Bio here'}</span>
                                </div>
                            </div>
                          <Link to={`/profile/${user?._id}`}>  <span className='text-[#3badf8] font-bold text-xs cursor-pointer hover:text-[#3b749a]'>View </span> </Link>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SuggestedUsers