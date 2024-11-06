import React, { useRef } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Loader2 } from 'lucide-react'
  import { useState } from 'react'
import { toast } from 'sonner'
import { setAuthUser } from '@/Redux/authSlice'
const EditProfile = () => {
    const {user}=useSelector((state)=>state.auth)
    const imageRef=useRef();
    const [loading, setLoading]=useState(false);
    const [input, setInput]=useState({
        profilePicture:user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender
    })
const navigate=useNavigate();
const dispatch=useDispatch();

const fileChangeHandler=(e)=>{

    const file=e.target.files?.[0];
    if(file){
        setInput({...input,profilePicture:file})
    }

}
const selectChangeHandler=(value)=>{
    setInput({...input,gender:value})
    
}


const editProfileHandler=async()=>{
  const formdata=new FormData()
  formdata.append("bio",input.bio)
  formdata.append("gender",input.gender)
  if(input.profilePicture){

    formdata.append("profilePicture",input.profilePicture)
  }
    // console.log(input)
    try {
        
        setLoading(true)
        const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/user/profile/edit`,{
            method:"POST",
            credentials:"include",
            body:formdata,
        
            
        })
        const data=await res.json();
        if(res.ok){
          const updatedUserData={...user,bio:data.user.bio,gender:data.user.gender,profilePicture:data.user.profilePicture}
          
          dispatch(setAuthUser(updatedUserData))
          
          setLoading(false)
            toast.success(data.message)
          navigate(`/profile/${user?._id}`) //ye karne se userprofile state of redux me vi update ho jaega kyuki refresh hoga
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
    finally{
        setLoading(false)

    }
}

  return (
    <div className='flex  max-w-2xl mx-auto pl-10 max-[1070px]:pl-20 max-[785px]:max-w-xl max-[686px]:max-w-lg max-[600px]:max-w-md max-[550px]:max-w-sm'>
        <section className='flex flex-col gap-6 w-full'>
            <h1 className='font-bold text-xl max-[550px]:font-semibold max-[550px]:text-md'>
                
                Edit Profile
            </h1>
            <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                <div className="flex items-center gap-3">


      <Avatar>
        <AvatarImage src={user?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>


      <div className="">
        <h1 className='font-bold text-sm'>{user?.userName}</h1>
        <span className='text-gray-600 text-sm'>{'Bio here'}</span>
                </div>
      </div>
      <input onChange={fileChangeHandler} ref={imageRef} type="file" name="" className='hidden' id="" />
      <Button onClick={()=>imageRef.current.click()} className="bg-[#0095f6] h-8 max-[550px]:w-30 max-[550px]:text-xs hover:bg-[#2d6b95]">Edit</Button>
    </div>
    <div>
        <h1 className='font-bold text-xl mb-2' >Bio</h1>
    <Textarea  value={input.bio} onChange={(e)=>setInput({...input,bio:e.target.value})} className="focus-visible:ring-transparent" name="bio" />
    </div>
    <div>
        <h1 className='font-bold mb-2 text-xl'>Gender</h1>
        <Select defaultValue={input.gender} onValueChange={selectChangeHandler} >
  <SelectTrigger className="w-[180px]">
    <SelectValue  />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="female">female</SelectItem>
    <SelectItem value="male">male</SelectItem>
  </SelectContent>
</Select>


    </div>
    <div className='flex justify-end' >
        {
            loading ?
            <Button  className="w-fit rounded-lg bg-[#0095f6] hover:bg-[#2d6b95] " ><Loader2 className='mr-2 h-4 w-4 animate-spin' />Wait</Button>
            :
        <Button onClick={editProfileHandler}  className="w-fit rounded-lg bg-[#0095f6] hover:bg-[#2d6b95] " >Submit</Button>
        }
    </div>

        </section>
    </div>
  )
}

export default EditProfile