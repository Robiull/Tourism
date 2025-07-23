const multer=require('multer')
const sharp=require('sharp')

const User=require('./../models/userModels');
const catchAsync=require('./../utils/catchAsync')
const appError=require('./../utils/appError')
const factory=require('./handlerFactory')


const multerStorage=multer.memoryStorage()

const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new appError('Not a image ,Please upload only images!',400),false)
    }
}

const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

exports.uploadUserPhoto=upload.single('photo')

exports.resizeUserPhoto=catchAsync(async(req,res,next)=>{
    if(!req.file){
        return next()
    }
    req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
        .resize(500,500)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/users/${req.file.filename}`)

    next();
})

const filterObj=(obj,...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
            newObj[el]=obj[el]
        }
    })
    return newObj
}

exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id
    next()
}

exports.updateMe=catchAsync(async(req,res,next)=>{

    console.log(req.file)
    console.log(req.body)
    //1)create error if user POST password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new appError('This route is not for the password update.Please use /updateMyPassword',400))
    }

    //2)Filtered out unwanted fields name that are not allowed to be updated
    const filteredBody=filterObj(req.body,'name','email')

    if(req.file)filteredBody.photo=req.file.filename
    //3)Update user document
    console.log(req.user)
    const updateUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true})
    res.status(200).json({
        status:'success',
        data:{
            user:updateUser
        }
    })
})

exports.createUser=(req,res)=>{
    res.status(500).json({
        status:'fail',
        message:'Go to Sign Up route '
    })
}
//Do not update password by this route
exports.updateUser=factory.updateOne(User)
exports.deleteUser=factory.deleteOne(User)
exports.getUser=factory.getOne(User) 
exports.getAllUser=factory.getAll(User)
exports.deleteMe=catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false})

    res.status(200).json({
        status:"success",
        data:null
    })
})