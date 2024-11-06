import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AtSign, Heart, MessageCircle, Trophy } from 'lucide-react'
import { setSelectedUser, setUserProfile } from '@/Redux/authSlice'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { setAuthUser } from '@/Redux/authSlice'
import { Loader2 } from 'lucide-react'

const Profile = () => {
  const dispatch=useDispatch();
  const params = useParams()
  const userId = params.id;
   useGetUserProfile(userId);
   const { userProfile,user } = useSelector((state) => state.auth)
   const navigate=useNavigate()
   


  // console.log(userProfile)
  const isLoggedInUserProfile = user?._id === userProfile?._id
  const [isFollowing, setisFollowing] = useState(false)
  // console.log("isfollowing ",isFollowing)
  const [activeTab, setActiveTab] = useState("posts")

  useEffect(() => {
    // Jab bhi userProfile ya user.following change ho, isFollowing update hoga
    if (userProfile && user) {
      setisFollowing(user.following.includes(userProfile._id));
    }
  }, [userProfile, user]);

  useEffect(()=>{
    return ()=>{
        dispatch(setUserProfile(null))
    }
},[])

  const handleTabChange = (tab) => {
    setActiveTab(tab)

  }

  const displayedPosts = activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks
  
  const followOrUnfollow=async ()=>{
    try {
      const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/user/followOrUnfollow/${userProfile?._id}`,{
        method:"POST",
        credentials:"include",
      })
      const data=await res.json();
      if(res.ok){
        toast.success(data.message)
        if(isFollowing){

          dispatch(setAuthUser({...user,following:user.following.filter((id)=>id!==userProfile?._id)}))
          dispatch(setUserProfile({...userProfile,followers:userProfile.followers.filter((id)=>id!==user?._id)}))
          setisFollowing(false)}
        else{
          let updatedData={...user,following:[...user.following,userProfile?._id]}
          // console.log("updated data of follow  is ",updatedData)
          dispatch(setAuthUser({...user,following:[...user.following,userProfile?._id]}))
          dispatch(setUserProfile({...userProfile,followers:[...userProfile.followers,user?._id]}))
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
    
     !userProfile ?
     (
    <Loader2 className='animate-spin absolute top-1/2 left-1/2' /> 
    )
      :
    (

      
      <div className='max-md:pl-24 flex max-w-5xl justify-center mx-auto max-xl:pl-40   pl-20 '>
      
            <div className='flex  flex-col max-sm:gap-12  gap-20 sm:p-8 max-sm:p-3'>

        <div className='sm:grid flex  flex-col sm:justify-center sm:grid-cols-2'>
          <section className='flex items-center justify-center '>
            <Avatar className="h-36 w-36 max-sm:h-16 max-sm:w-16 mb-2">
            <AvatarImage src={userProfile?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
            </Avatar>

          </section>
          <section>
            <div className='flex flex-col overflow-hidden  gap-5'>
              <div className='flex gap-2 max-sm:justify-between items-center'>

                <span className='font-semibold capitalize max-[430px]:text-sm ' >{userProfile?.userName}</span>
                {
                  isLoggedInUserProfile ?
                    //condition for logged in user 
                    <>
                    
                     <Link to="/profile/edit">   <Button variant="secondary" className="hover:bg-gray-200  h-8">Edit Profile</Button></Link>
                    
                    </> : (
                      isFollowing ?
                        (
                          <>
                            <Button onClick={followOrUnfollow} variant="secondary" className=" " >Unfollow</Button>
                            <Button onClick={()=>{
                              dispatch(setSelectedUser(userProfile))
                              navigate(`/chat`) 
                            }} className="" variant="secondary">Message</Button>
                          </>

                        )
                        : <Button onClick={followOrUnfollow} className=" rounded-lg h-8 bg-[#0095F6] hover:bg-blue-300" >Follow</Button>
                    )
                }
              </div>
              <div className='flex max-sm:justify-between items-center gap-4 max-[430px]:text-xs'>
                <p className='text-center font-semibold'>{userProfile?.posts?.length} <span className='font-normal' >Posts</span></p>
                <p className='text-center font-semibold'>{userProfile?.followers?.length} <span className='font-normal' >Followers</span></p>
                <p className='text-center font-semibold'>{userProfile?.following?.length} <span className='font-normal' >Following</span></p>
              </div>
              <div className='flex flex-col max-[430px]:text-xs   gap-1'>
                <span className='max-[430px]:font-normal font-semibold'>{userProfile?.bio || 'No bio'}</span>
              <div className=' sm:hidden w-full  max-[430px]:my-1 text-center'>

                <Badge className="w-fit " variant="secondary"><AtSign /> <span className='pl-1'>{userProfile?.userName}</span> </Badge>
              </div>
                <span className=' max-sm:block max-sm:w-full max-sm:my-1 max-sm:text-center'>This website is done by Amandeep_Rawat®️❤️</span>
               
                </div>
                </div>
                
          </section>

          </div>
        <div className='border-t border-t-gray-200'>
          <div className="flex items-center justify-center gap-10 text-sm">
            <span onClick={() => handleTabChange("posts")} className={`py-3 cursor-pointer ${activeTab === "posts" ? 'font-bold' : ""}`}>
              POSTS
            </span>
            <span onClick={() => handleTabChange("saved")} className={`py-3 cursor-pointer  ${activeTab === "saved" ? 'font-bold' : ""}`}>
              SAVED
            </span>
            <span onClick={() => handleTabChange("reels")} className={`py-3 cursor-pointer  ${activeTab === "reels" ? 'font-bold' : ""}`}>
            REELS
            </span>
            <span onClick={() => handleTabChange("tags")} className={`py-3 cursor-pointer  ${activeTab === "tags" ? 'font-bold' : ""}`}>
              TAGS
            </span>
          </div>
          <div className='grid grid-cols-3 max-sm:grid-cols-2 gap-2'>
            {
              displayedPosts?.map((post) => {
                return (
                  <div key={post?._id} className='relative  cursor-pointer'>
                    <img src={post?.image} alt="post_image" className='rounded-sm my-2 w-full aspect-square object-cover ' />
                    <div className='  absolute rounded inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300'>
                      <div className="flex items-center text-white space-x-4">                              <button className="flex items-center text-white space-x-4 gap-2  hover:text-gray-300"><Heart />
                        <span>{post?.likes?.length}</span></button>
                        <button  className="flex items-center text-white space-x-4 gap-2  hover:text-gray-300"><MessageCircle />
                          <span>{post?.comments?.length}</span></button>


                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

        </div>
      </div>
    </div>
  )
  
)
}

export default Profile