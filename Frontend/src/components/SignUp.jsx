import {React,useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
const SignUp = () => {
    const navigate=useNavigate()
    const [input, setInput] = useState({
        userName: "",
        email: "",
        password: ""    
    })
    const [loading, setLoading] = useState(false);
    const {user}=useSelector((state)=>state.auth)
    const changeEventHandler=async(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }


    useEffect(() => {
        if(user){
          navigate("/")
        }
      }, []);
      

    const singUpHandler=async (e)=>{
        // to not refresh e.preventdefault
        e.preventDefault();
        // console.log(input)
        try {
            setLoading(true);
            const res=await fetch(`${import.meta.env.VITE_URL}/api/v1/user/register`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(input)
            })
            if(res.ok){
                const data=await res.json()
                toast.success(data.message)
                navigate("/login")

                // input field clear ho jaega input tags me 
                setInput({
                    userName: "",
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
        <form action="" onSubmit={singUpHandler} className='shadow-lg flex flex-col gap-4 p-8'>
            <div>
                <h1 className='text-center my-1 font-bold text-2xl'>HyThere</h1>
                <p className='text-sm text-center'>SignUp to see photos and videos of Your friends</p>
            </div>
            <div>
                <Label className="font-medium">UserName</Label>
                <Input type="text" placeholder='UserName' name="userName" onChange={changeEventHandler} value={input.userName} className="my-2 focus-visible:ring-transparent"/>
            </div>
            <div>
                <Label className="font-medium">Email</Label>
                <Input type="text" placeholder='email' name="email" onChange={changeEventHandler} value={input.email} className="my-2 focus-visible:ring-transparent"/>
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
            <Button className="" type="submit" variant="destructive">SignUp</Button>
            }
            <span  >Already have an account? <Link className='text-blue-600' to="/login">Login</Link></span>
        </form>
    </div>
    </>
  )
}

export default SignUp