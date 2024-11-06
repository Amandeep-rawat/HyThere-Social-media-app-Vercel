import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import React from 'react'


import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { Link } from 'react-router-dom';
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/Redux/postSlice';
import { Badge } from './ui/badge';
import { setAuthUser } from '@/Redux/authSlice';
import { useNavigate } from 'react-router-dom';


const Post = ({ post }) => {
  
  const [text, settext] = useState("");
  const [open, setopen] = useState(false)
  const [loader, setloader] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const { posts } = useSelector((state) => state.post)
  const dispatch = useDispatch()
  const navigate=useNavigate();
  const [liked, setliked] = useState(post.likes.includes(user?._id) || false)
  const [postLike, setPostLike] = useState(post?.likes?.length)
  const [bookmarked,setbookmarked]=useState(user?.bookmarks.includes(post?._id) || false)
  // const [comment, setcomment] = useState(post?.comments)


  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      settext(inputText);
    } else {
      settext("")
    }

  }


  const deletePostHandler = async () => {
    setloader(true);
    let postId = post._id;

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/v1/post/delete/${postId}`,
        {
          method: "Post",
          credentials: "include",

        })
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message)
        const updatedPosts = posts.filter((post) => post._id !== postId);
        setloader(false);
        dispatch(setPosts(updatedPosts))


      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    finally {
      setloader(false)
    }
  }



  const likeOrDislike = async () => {
    try {
      const action = liked ? "disLike" : "like";

      // console.log(post._id)

      const res = await fetch(`${import.meta.env.VITE_URL}/api/v1/post/${post._id}/${action}`,
        {
          method: "GET",
          credentials: "include",

        })
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;


      }
      else {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes)
        setliked(!liked)


        // update post like count
        const updatedPostData = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p, likes: liked ? p.likes.filter((id) => id !== user._id) : [...p.likes, user._id]
            }

          }
          return p
        })
        dispatch(setPosts(updatedPostData))
        // this code correspond to this 
        // const updatedPostData = posts.map((p) => {
        //   if (p._id === post._id) {
        //     // If the user has already liked the post
        //     if (liked) {
        //       // Remove user's like
        //       const filteredLikes = p.likes.filter((id) => id !== user._id);
        //       p.likes = filteredLikes;
        //     } else {
        //       // Add user's like
        //       p.likes.push(user._id);
        //     }
        //     return p;
        //   }
        //   return p; // Return unchanged post for other posts
        // });





        toast.success(data.message);

      }

    }
    catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


const commentHandler=async(e)=>{

  try {
    setloader(true);
    const postId=post._id;
    const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/post/${postId}/comment`,{
      method:"POST",
      credentials:"include",
      body:JSON.stringify({text}),
      headers:{
        "Content-Type":"application/json"
      }

    })
    const data=await res.json();
    // console.log("data is ",data)
    if(!res.ok){
      toast.error(data.message);
      return;
    }
    toast.success(data.message);

    settext("")
    // console.log("post comment on redux",post.comments)
    // console.log("response data comment",data.comment)
    const updatedCommentData=[...post.comments,data.comment];
    // console.log("updated comment data ",updatedCommentData)

    const updatedPostData = posts.map((p) => {
      if (p._id === post._id) {
        return {
          ...p, comments:updatedCommentData
        }

      }
      return p
    })
    dispatch(setPosts(updatedPostData))

  } catch (error) {
    toast.error(error.message);
    console.log(error);
  }
  finally{
    setloader(false)
  }
}


const bookmarkHandler=async ()=>{
  try {
    const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/post/${post?._id}/bookmark`,{
      method:"POST",
      credentials:"include",

    })
    const data=await res.json();
    // console.log(" bookmark data is ",data)
    if(!res.ok){
      toast.error(data.message);
      return;
    }
    toast.success(data.message);
    if(bookmarked == false){ 

      dispatch(setAuthUser({...user,bookmarks:[...user.bookmarks,post?._id]}))
      setbookmarked(true)
    }
    else{

      
      dispatch(setAuthUser({...user,bookmarks:user.bookmarks.filter((id)=>id!==post?._id)}))
      setbookmarked(false)
    }

  } catch (error) {
    console.log(error,error.message)
  }
}

const [isFollowing,setisFollowing]=useState(user?.following.includes(post?.author?._id) || false);


const followOrUnfollow=async ()=>{
  try {
    const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/user/followOrUnfollow/${post?.author?._id}`,{
      method:"POST",
      credentials:"include",
    })
    const data=await res.json();
    if(res.ok){
      toast.success(data.message)
      if(isFollowing){

        dispatch(setAuthUser({...user,following:user.following.filter((id)=>id!==post?.author?._id)}))
       // dispatch(setUserProfile({...userProfile,followers:userProfile.followers.filter((id)=>id!==user?._id)}))
        setisFollowing(false)}
      else{
        let updatedData={...user,following:[...user.following,post?.author?._id]}
        // console.log("updated data of follow  is ",updatedData)
        dispatch(setAuthUser({...user,following:[...user.following,post?.author?._id]}))
  //      dispatch(setUserProfile({...userProfile,followers:[...userProfile.followers,user?._id]}))
        setisFollowing(true)
      }
      }
    
    else{
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)

  }
}

  return (

    <div className='my-8 w-full max-w-sm max-sm:max-w-xs max-[460px]:max-w-60 mx-auto'>
      <div className='flex items-center justify-between'>

        <div className='flex items-center gap-2'>
          <Link to= {`/profile/${post?.author?._id}`}>
          <Avatar className='w-6 cursor-pointer h-6' >
            <AvatarImage src={post?.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>

          </Avatar>
          </Link>
          <div className='flex items-center gap-3'>

          <h1 className='cursor-pointer' onClick={()=>navigate(`/profile/${post?.author?._id}`)} >{post?.author?.userName}</h1>
          {
            user?._id === post?.author?._id ?
          <Badge variant="secondary" >Author</Badge> : ""
          }
          </div>

        </div>
        <Dialog >
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
              post?.author?._id !== user?._id &&
            <Button variant="ghost" onClick={followOrUnfollow} className="cursor-pointer w-fit text-[#ed4956] font-bold">{
              isFollowing ? "Unfollow" : "Follow"
            
            }</Button>
            }

            <Button onClick={()=>{
              alert("working on it.. you can check Delete option....")
            }} variant="ghost" className="cursor-pointer w-fit">Add to Favorites</Button>

            {
              user && user?._id === post?.author?._id && (
                loader ? <Loader2 className='w-4 h-4 animate-spin' /> :

                  <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit text-[#ed4956] font-bold">Delete</Button>
              )
            }
          </DialogContent>

        </Dialog>

      </div>
      <img className='rounded-sm my-2 w-full aspect-square object-contain' src={post?.image} alt="post_img" />

      <div className='flex items-center justify-between my-2'>

        <div className='flex items-center gap-3'>
          {
            liked ? <FaHeart fill='red' onClick={likeOrDislike} className='cursor-pointer hover:text-gray-600 ' size={"22px"} />
              : <FaRegHeart onClick={likeOrDislike} className='cursor-pointer hover:text-gray-600 ' size={"22px"} />
          }

          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post));
            setopen(true)
          }} className='cursor-pointer hover:text-gray-600' />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
{
  bookmarked?
  <Bookmark fill="black" onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
:

  <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />

}
      </div>
      <span className='font-medium block mb-2'>{postLike} likes</span>
      <p>
        <span className='font-medium mr-2'>
          {post?.author?.userName}
        </span>
        {post?.caption}
      </p>

{
  post?.comments?.length <= 0?
  (

    
    <span className='cursor-pointer text-sm text-gray-600'> No comments</span>
  ):
      <span className='cursor-pointer text-sm text-gray-600' onClick={() => {
        setopen(true)
        dispatch(setSelectedPost(post));
        }} >View all {post?.comments?.length} comments</span>
      
  }

      
      <CommentDialog open={open} setOpen={setopen} />
      <div className='flex'>
        <input
          className='outline-none w-full text-sm'
          type="text"
          value={text}
          onChange={changeEventHandler}

          placeholder='Add a comment' />
        {
          text && (loader ? <Loader2 className='w-4 h-4 animate-spin' /> : <span onClick={commentHandler} className=" cursor-pointer hover:text-blue-600 font-semibold text-[#3badf8]">Send</span>)

        }
      </div>

    </div>
  )
}

export default Post