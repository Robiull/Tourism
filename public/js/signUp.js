import axios from 'axios'
import {showAlert} from './alert'

export const signUp=async(name,email,password,passwordConfirm)=>{
    try{
        const res= await axios({
            method:'POST',
            url:'/api/v1/user/signup',
            data:{
                name,
                email,
                password,
                passwordConfirm
            }
        })

        if(res.data.status==='success'){
            showAlert('success','Sign Up successfully!')
            window.setTimeout(()=>{
                location.assign('/me')
            },1500)
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}