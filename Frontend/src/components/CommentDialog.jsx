import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AvatarFallback, AvatarImage, Avatar } from './ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Comment from './Comment';
import { setPosts, setSelectedPost } from '@/Redux/postSlice';
import { useEffect } from 'react';
const CommentDialog = ({ open, setOpen,}) => {
    const dispatch=useDispatch();
    const {selectedPost,posts}=useSelector((state)=>state.post)
    // another method 
    // const post=useSelector((state)=>state.post.selectedPost)

    const [text, setText] = useState("")

    const [comments, setComments] = useState(selectedPost?.comments || []);

useEffect(() => {
    setComments(selectedPost?.comments || []);
}, [selectedPost]);

    
    const changeEventHandler = (e) => {
        if(e.target.value.trim())
        {

            setText(e.target.value);
        }
        else{
            setText("");
        }
    }



    const sendMessageHandler=async(e)=>{
        try {
          const postId=selectedPost._id;
          const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/post/${postId}/comment`,{
            method:"POST",
            credentials:"include",
            body:JSON.stringify({text}),
            headers:{
              "Content-Type":"application/json"
            }
      
          })
          const data=await res.json();
        //   console.log("data is ",data)
          if(!res.ok){
            toast.error(data.message);
            return;
          }
          toast.success(data.message);
      
          setText("")
        //   console.log("post comment on redux",selectedPost.comments)
        //   console.log("response data comment",data.comment)
          const updatedCommentData=[...selectedPost.comments,data.comment];
        //   console.log("updated comment data ",updatedCommentData)
      
          const updatedPostData = posts.map((p) => {
            if (p._id === selectedPost._id) {
              return {
                ...p, comments:updatedCommentData
              }
      
            }
            return p
          })
          dispatch(setPosts(updatedPostData))
//ye niche wali line selected post ko update kar rhi he . wese to niche niche ham selectedpost.map vi kar sakte the jaha maine comments.map likha he lekin state isliye banayi comments setcomment ki for fast rendring otherwise pehle selectedpost ko dispatch  karna padta phir jake wo load hota post find karta .
          
          const updatedPost = updatedPostData.find(p => p._id === selectedPost._id); //not neccesary
dispatch(setSelectedPost(updatedPost));

      
        } catch (error) {
          toast.error(error.message);
          console.log(error);
        }
      }
      
      


    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col  ">
                <div className='flex flex-1'>

                    <div className='w-1/2 '>

                        <img className='w-full h-[80vh] object-contain rounded-l-lg' src={selectedPost?.image} alt="" />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center'>

                            <Link>
                                <Avatar className='w-6 h-6'>
                                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div><Link className="font-semibold text-xs">
                    {selectedPost?.author?.userName}</Link>
                            {/* <span className='text-gray-600 text-sm'>
                                Bio here...</span> */}
                            
                            </div>

                            </div>
                                <Dialog className="border-none">
                                    <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer'/>
                                    </DialogTrigger>
                                        <DialogContent className="text-center text-sm flex flex-col items-center">
                                            <div className='cursor-pointer w-full text-[#ed4956] font-bold'>
                                                Unfollow
                                            </div>
                                            <div className='cursor-pointer w-full '>Add to Favorites</div>
                                        </DialogContent>
                                </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96'>
                            {
                                comments.map((comment)=>{
                                    return (
                                        <Comment key={comment?._id} comment={comment}/>
                                    )
                                })
                            }
                        </div>
                        <div className='p-4'>
                                <div className='flex items-center gap-2'>
                                    <input 
                                    type="text"
                                    value={text}
                                    onChange={changeEventHandler}

                                    placeholder='Add a comment...'
                                    className='w-full outline-none  border-gray-300 p-2 rounded'
                                    />
                                    <Button disabled={!text} onClick={sendMessageHandler} variant="outline">Send</Button> 
                                </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default CommentDialog;