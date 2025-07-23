import '@babel/polyfill'
import { displayMap } from './mapbox'
import {login,logout} from './login'
import { updateSettings} from './updateSetting'
import {signUp} from './signUp'
import {forgotPassword,resetPassword} from './forgotPassword'
import {bookTour} from './stripe'

const mapBox=document.getElementById('map')
const loginForm=document.querySelector('.form--login')
const logoutBtn=document.querySelector('.nav__el--logout')
const userDataForm=document.querySelector('.form-user-data')
const userPasswordForm=document.querySelector('.form-user-password')
const signUpForm=document.querySelector('.form-signup')
const forgotPasswordForm=document.querySelector('.form--forgot-password')
const resetPasswordFrom=document.querySelector('.resetPasswordForm')
const bookBtn=document.getElementById('book-tour')


if(mapBox){
    const locations=JSON.parse(mapBox.dataset.location)
    displayMap(locations)
}


if(loginForm){
    loginForm.addEventListener('submit',e=>{
        e.preventDefault()
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password)
    })
}

if(userDataForm){
    userDataForm.addEventListener('submit',el=>{
        el.preventDefault()

        const form=new FormData()

        form.append('name',document.getElementById('name').value)
        form.append('email',document.getElementById('email').value)
        form.append('photo',document.getElementById('photo').files[0])

        updateSettings(form,'data')
    })
}
if(userPasswordForm){
    userPasswordForm.addEventListener('submit',async el=>{
        el.preventDefault()
        document.querySelector('.btn-save-password').textContent='Updating...'

        const passwordCurrent=document.getElementById('password-current').value
        const password=document.getElementById('password').value
        const passwordConfirm=document.getElementById('password-confirm').value

        await updateSettings({passwordCurrent,password,passwordConfirm},'password')

        document.querySelector('.btn-save-password').textContent='save password'

        document.getElementById('password-current').value=''
        document.getElementById('password').value=''
        document.getElementById('password-confirm').value=''
    })
}

if(logoutBtn){
    logoutBtn.addEventListener('click',logout)
}

if(signUpForm){
    signUpForm.addEventListener('submit',e=>{
        e.preventDefault()
        const name=document.getElementById('name').value
        const email=document.getElementById('email').value
        const password=document.getElementById('password').value
        const passwordConfirm=document.getElementById('confirm-password').value
        signUp(name,email,password,passwordConfirm)
    })
}

if(forgotPasswordForm){
    forgotPasswordForm.addEventListener('submit',e=>{
        e.preventDefault()
        const email=document.getElementById('email').value
        forgotPassword(email)
    })
}

if(resetPasswordFrom){
    resetPasswordFrom.addEventListener('submit',e=>{
        e.preventDefault()
        const password=document.getElementById('password').value
        const passwordConfirm=document.getElementById('confirm-password').value
        resetPassword(password,passwordConfirm,token)
    })
}

if(bookBtn){
    bookBtn.addEventListener('click',e=>{
        e.target.textContent='Precessing....'
        const {tourId}=e.target.dataset
        bookTour(tourId)
    })
}