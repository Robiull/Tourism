const crypto=require('crypto')
const mongoose=require('mongoose');
const validator =require('validator');
const bcrypt=require('bcryptjs');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please us your name'],
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide your valid email']
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minLength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator:function(el){
                return el===this.password
            },
            message:'Password are not the same!'
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpire:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})
userSchema.pre('save',async function(next){
    //Only run this function if the password was actually modified
    if(!this.isModified('password'))return next();

    //Hash the password with cost of 12
    this.password=await bcrypt.hash(this.password,12)
    //Delete confirm password field
    this.passwordConfirm=undefined
    next()
})

userSchema.pre('save',function(next){
    if(this.isModified('password')||this.isNew)return next()
    
    this.passwordChangedAt=Date.now()-1000

    next();
})

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    next()
})

userSchema.methods.correctPassword= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10)
        return JWTTimestamp<changedTimestamp
    }
    return false
}

userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex')
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpire=Date.now()+10*60*1000

    // console.log({resetToken},this.passwordResetToken)

    return resetToken;
}
const User=mongoose.model('User',userSchema)
module.exports=User;