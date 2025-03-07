import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form"
const Signin = () => {
    const navigate = useNavigate();
    const {register,handleSubmit,reset} = useForm();
    const onsubmit = async (data:any) =>{
        try{
            await axios.post("http://localhost:3000/api/v1/signin",data,{
                withCredentials:true
            });
            navigate("/dashboard")
            alert("Signed In!!!")
            reset();
        }
        catch{
            console.log("Error in signin!!!");
        }
    }
  return (
    <form onSubmit={handleSubmit(onsubmit)} className="flex gap-4 flex-col">
        <input placeholder="Name" {...register("userName",{required:true})}></input>
        <input placeholder="Passsword" type="password" {...register("userPassword",{required:true})}></input>
        <button type="submit">Submit</button>
    </form>
  )
}

export default Signin