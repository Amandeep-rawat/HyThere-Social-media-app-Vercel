import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'


const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex gap-3 items-center'>
            <Avatar className="w-6 h-6">
                <AvatarImage src={comment?.author?.profilePicture}/>
                <AvatarFallback>CN</AvatarFallback>

            </Avatar>
            <h1 className='font-semibold text-sm'>{comment?.author?.userName} <span className='font-normal pl-2'>{comment?.text}</span></h1>
        </div>
    </div>
)
}

export default Comment