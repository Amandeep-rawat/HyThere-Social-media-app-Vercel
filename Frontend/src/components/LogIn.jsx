import {React,useState} from 'react'

import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from "sonner"
import { Link, useNavigate } from 'react-router-dom'
import { Loader, Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/Redux/authSlice'
import { useEffect } from 'react'

const LogIn = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [input, setInput] = useState({
        email: "",
        password: ""    
    })
    const [loading, setLoading] = useState(false);
    const {user}=useSelector((state)=>state.auth)

//for protected route too isse ham login hokar wapas login page pe nhi ja sakte . directly urlse 
useEffect(() => {
  if(user){
    navigate("/")
  }
}, []);


    const changeEventHandler=async(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }

    const logInHandler=async (e)=>{
        // to not refresh e.preventdefault
        e.preventDefault();
        // console.log(input)
        try {
            setLoading(true);
            const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/user/logIn`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include", //toooo much importanat thing to see cookies in cookies section of browser
                body:JSON.stringify(input)
            })
            if(res.ok){
                const data=await res.json()
                // console.log("frontend data of user",data.user);
                dispatch(setAuthUser(data.user))
                toast.success(data.message)
                navigate("/");

                // input field clear ho jaega input tags me 
                setInput({
        
                    email: "",
                    password: "" 
                })

            }
            else{
                const errorData = await res.json();
                toast.error(errorData.message);
            }
               
            
        } catch (error) {
            console.log(error)
            toast.error("something went wrong ")
            
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <>
    <div className="flex items-center w-screen h-screen justify-center">
        <form action="" onSubmit={logInHandler} className='shadow-lg flex flex-col gap-4 p-8'>
            <div>
                <h1 className='text-center my-1 font-bold text-2xl'>HyThere</h1>
                <p className='text-sm text-center'>LogIn to see photos and videos of Your friends</p>
            </div>
        
            <div>
                <Label className="font-medium">Email</Label>
                <Input type="text" placeholder='Email' name="email" onChange={changeEventHandler} value={input.email} className="my-2 focus-visible:ring-transparent"/>
            </div>
            <div>
                <Label className="font-medium">Password</Label>
                <Input type="text" placeholder='Password' name="password" onChange={changeEventHandler} value={input.password} className="my-2 focus-visible:ring-transparent"/>
            </div>
            {
                loading?
                    <Button>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        Please wait
                    </Button>
                :
            <Button className="" type="submit" variant="destructive">LogIn</Button>
            }
            <span>Does not have an account? <Link className='text-blue-600' to="/signup">SignUp</Link></span>

        </form>
    </div>
    </>
  )
}

export default LogIn