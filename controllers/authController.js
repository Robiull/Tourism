const crypto=require('crypto')
const {promisify}=require('util')
const jwt=require('jsonwebtoken')
const User=require('./../models/userModels')
const catchAsync=require('./../utils/catchAsync')
const appError=require('./../utils/appError')
const Email=require('./../utils/email')
const { token } = require('morgan')


const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}

const createSendToken=(user,statusCode,res)=>{
    const token=signToken(user._id)
    const cookieOptions={
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24 *60 *60 *1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV.trim()==='production'){
        cookieOptions.secure=true
    }
    res.cookie('jwt',token ,cookieOptions)

    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user:user
        }
    })
}

exports.signUp=catchAsync(async(req,res,next)=>{
    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        photo:req.body.photo,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        passwordChangedAt:req.body.passwordChangedAt
    })
    const url=`${req.protocol}://${req.get('host')}/me`
    console.log(url)
    await new Email(newUser,url).sendWelcome()

    createSendToken(newUser,201,res)

})


exports.login=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body
    //1)Check if email and password exits
    if(!email||!password){
        return next(new appError('Please provide email and password',400))
    }

    //2)Check if user exits and password is correct
    const user=await User.findOne({email}).select('+password')

    if(!user||!(await user.correctPassword(password,user.password))){
        return next(new appError('Incorrect email or password !',401))
    }

    //3)if everything ok, send token to client
    createSendToken(user,200,res)
})


exports.protect=catchAsync(async(req,res,next)=>{
    //1)Getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]
    }else if(req.cookies.jwt){
        token=req.cookies.jwt
    }
    
    if(!token){
        return next(new appError('You are not Logged in! Please logging to get access ',401))
    }
    
    //2)verification token
    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET)

    //3)Check if user still exits
    const currentUser=await User.findById(decoded.id)

    if(!currentUser){
        return next(new appError('The user belonging to the token does no exits!',401))
    }

    //4)Check if user change password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new appError('User recently changed password! Please log in again!',401))
    }
    req.user=currentUser;
    res.locals.user=currentUser
    next()
})

exports.isLoggedIn=async(req,res,next)=>{
    try{
        if(req.cookies.jwt){
            //1)verify token
            const decoded=await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
    
            //2)Check if user still exits
            const currentUser=await User.findById(decoded.id)
    
            if(!currentUser){
                return next()
            }
    
            //4)Check if user change password after the token was issued
            if(currentUser.changedPasswordAfter(decoded.iat)){
                return next()
            }
            //There is a Logged in User
            res.locals.user=currentUser
            return next()
        }
    }catch(err){
        //There is a Logged out User
        return next()
    }
    next()

}

exports.logOut=(req,res)=>{
    res.cookie('jwt','loggedOut',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    })

    res.status(200).json({
        status:'success'
    })
}

exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new appError('You do not have permission to perform this action!',403))
        }
        next();
    }
}


exports.forgotPassword=catchAsync(async (req,res,next)=>{
    //1)Get user based on POSTed email
    const user= await User.findOne({email:req.body.email})
    if(!user){
        return next(new appError('There is no user with email address',404))
    }

    //2)Generate the random reset token
    const resetToken=user.createPasswordResetToken();
    // await user.save();
    await user.save({validateBeforeSave:false});

    //3)send it to user email

    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`

    const message=`Forgot your password? Submit a PATCH request with your new password and password Confirm to:${resetURL}.
    if did not forget your password.Please ignore this email`

    try{
        await new Email(user,resetURL).sendPasswordReset()
        res.status(200).json({
            status:'success',
            message:'Token send to email'
        })
    }catch(err){
        console.log(err)
        user.passwordResetToken=undefined;
        user.passwordResetExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new appError('There was an error sending the email. Try again later!',500))

    }
})


exports.resetPassword=catchAsync(async(req,res,next)=>{
    //1)Get User based on the token
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpire:{$gt: Date.now()}})
    //2)If token has not expired and there is user, set the new password
    if(!user){
        return next(new appError('Token is invalid or has expired',400))
    }
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm
    user.passwordResetToken=undefined
    user.passwordResetExpire=undefined
    await user.save()
    createSendToken(user,200,res)
})


exports.updatePassword=catchAsync(async(req,res,next)=>{
    //1)Get user from collection
    const user=await User.findById(req.user.id).select('+password')
    //2)Check if POSTed current password is correct
    if(!await user.correctPassword(req.body.passwordCurrent,user.password)){
        return next(new appError('Your current password is wrong',401))
    }
    //3)if password is correct then update the password
    user.password=req.body.password
    user.passwordConfirm=req.body.passwordConfirm
    await user.save();
    // User.findByIdAndUpdate will not work as intended

    //4)Log user in and send JWT
    createSendToken(user,200,res) 
})