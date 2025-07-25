import axios from 'axios'
import {showAlert} from './alert'

export const forgotPassword=async(email)=>{
    try{
        const res= await axios({
            method:'POST',
            url:'/api/v1/user/forgotPassword',
            data:{
                email
            }
        })

        if(res.data.status==='success'){
            showAlert('success','Send Reset password token to your email')
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}
export const resetPassword=async(password,passwordConfirm,token)=>{
    try{
        const res= await axios({
            method:'PATCH',
            url:`/api/v1/user/resetPassword/${token}`,
            data:{
                password,
                passwordConfirm
            }
        })

        if(res.data.status==='success'){
            showAlert('success','Send Reset password token to your email')
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}