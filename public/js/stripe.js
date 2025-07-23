import axios from 'axios'
import {showAlert} from './alert'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise= loadStripe('pk_test_51RnkMQ81XNBuuiIcb5KAlJhkTnkTO6s5yt04WQribftV3IxDClkJRW3XxPATI5BMkpcULuktwSmcXnApkQvKzD2F00ifgqOSEF')

export const bookTour=async tourId=>{
    try{
        
        const stripe = await stripePromise
        //1)Get checkout session from API
        const session=await axios(`/api/v1/bookings/checkout-session/${tourId}`)

        //2)create checkout from and charge credit card
        const {error}=await stripe.redirectToCheckout({
            sessionId:session.data.session.id
        })
        if(error){
            showAlert('error',error.message);
        }
    }catch(err){
        showAlert('error',err)
    }
} 