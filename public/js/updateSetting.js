import axios from 'axios'
import {showAlert} from './alert'

export const updateSettings=async(data,type)=>{
    try{
        const url=type==='password'?'/api/v1/user/updateMyPassword':'/api/v1/user/updateMe'
        const res=await axios({
            method:'PATCH',
            url,
            data
        })
        if(res.data.status==='success'){
            showAlert('success',`${type.toUpperCase()} updated Successfully!`)
            window.setTimeout(()=>{
                location.assign('/me')
            },1500)
        }

    }catch(err){
        showAlert('error',err.response.data.message)
    }
}
