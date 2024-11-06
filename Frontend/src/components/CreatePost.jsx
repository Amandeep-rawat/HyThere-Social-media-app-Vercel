import React, { useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
// import { Textarea } from "@/components/ui/textarea"
import { readFileAsDataURL } from '@/utils/dataUri';
import { Cross, CrossIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/Redux/postSlice';




const CreatePost = ({open,setOpen}) => {
const {user}=useSelector((state)=>state.auth)
const {posts}=useSelector((state)=>state.post)
const dispatch=useDispatch();
const imageRef=useRef();
const [file,setFile]=useState("");
const [caption,setCaption]=useState("");
const [imagePreview,setImagePreview]=useState("");
const [loading,setLoading]=useState(false);
const createPostHandler=async (e)=>{
const formdata=new FormData();
if(imagePreview){

  formdata.append("image",file);
}
formdata.append("caption",caption);
// for (let [key, value] of formdata.entries()) {
//   console.log(key, value);
// }
try {
  setLoading(true);
      const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/post/addPost`,{
        method:"POST",
        // header not necesary browser automatiacalyy set headers to formdata 
        // headers:{
        //   "Content-Type":"application/json",
        // },
        body:formdata,
        credentials:"include"  //creadentails are neccesary for cookies to work
      });
      const data=await res.json();
      if(res.ok){
        toast.success(data.message);
        dispatch(setPosts([data.post,...posts]));
        setOpen(false);
        setCaption("");
        setImagePreview("");
        setFile("");
      }
      else{
        toast.error(data.message);
        
      }
      // console.log(file,caption);
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
    finally{
      setLoading(false);

    }
  }
  const fileChangeHandler=async (e)=>{
    const file=e.target.files?.[0];
    // console.log(file);
    if(file){
      setFile(file);
      const dataurl=await readFileAsDataURL(file);
      setImagePreview(dataurl);
    }
  }
  return (
    <Dialog open={open}>
    
    <DialogContent onInteractOutside={() => setOpen(false)} >
      <DialogHeader className=" font-semibold">
       
       <DialogTitle className="flex justify-start" > Create New Post</DialogTitle>
       <CrossIcon fill='red' onClick={() => setOpen(false)} className='absolute rotate-45 top-3 right-2 cursor-pointer'/>
       <DialogDescription></DialogDescription>
       
      </DialogHeader>
      <div className='flex gap-3 items-center' >
      <Avatar>
        <AvatarImage src={user?.profilePicture} alt="CN"/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="font-semibold text-xs">
        {user?.userName}
        </h1>
        <span>{user?.bio}</span>
      </div>
      </div>
      <Textarea value={caption} onChange={(e)=>setCaption(e.target.value)} className=" focus-visible:ring-transparent border-none" placeholder="write a caption"  />{
        imagePreview &&(
          <div className='w-full h-64 flex items-center justify-center'>
            <img src={imagePreview} className='object-cover h-full w-full rounded-md' alt="preview_img" />
          </div>
        )
      }
      <input onChange={fileChangeHandler} ref={imageRef} type="file" name="" className='hidden' id="" />
      <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-[#0095f6] hover:bg-[#346688]">Select from Device</Button>
      {
        imagePreview &&(
          loading ?(
            <Button><Loader2  className='mr-2 h-3 w-4 animate-spin'/>please wait </Button>
          ):(

            <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
          )
        )
      }
    
    </DialogContent>
  </Dialog>
  
  )
}

export default CreatePost