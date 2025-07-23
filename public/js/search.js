import axios from 'axios'
import {showAlert} from './alert'

export const forgotPassword=async(search)=>{
    try{
        const res= await axios({
            method:'GET',
            url:`/api/v1/tours`,
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