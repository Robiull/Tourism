import axios from 'axios'
import {showAlert} from './alert'
export const login=async(email,password)=>{
    try{
        const res=await axios({
            method:'POST',
            url:'/api/v1/user/login',
            data:{
                email,
                password
            }
        })
        if(res.data.status==='success'){
            showAlert('success','Logged in Successfully!')
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }
        
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}

export const logout=async()=>{
    try{
        const res=await axios({
            method:'GET',
            url:'/api/v1/user/logout'

        })

        if(res.data.status==='success'){
            location.reload(true)
        }
    }catch(err){
        showAlert('error','Error logging Out! Try Again.')
    }
}