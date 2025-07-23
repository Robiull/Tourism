const appError = require("./../utils/appError")

const handleCastErrorDB=err=>{
  const message=`Invalid ${err.path}: ${err.value}`
  return new appError(message,400)
}

const handleDuplicateFieldsDB=(err)=>{
  const message=`Duplicate field value :" ${err.keyValue.name} ".Please use another value`
  return new appError(message,400)
}

const handleValidationErrorDB=(err)=>{
  const errors=Object.values(err.errors).map(el=>el.message)
  const message=`Invalid input data! ${errors.join('. ')}`
  return new appError(message,400)
}

const handleJWTError=()=>new appError('Invalid Token! Please Log in again!',401)

const handleJWTExpiredError=()=>new appError('Your token has expired! Please Log in again!',401)


const sendErrorDev=(err,req,res)=>{
  //A)API
  if(req.originalUrl.startsWith('/api')){
    return res.status(err.statusCode).json({
      status:err.status,
      error:err,
      message:err.message,
      stack:err.stack
    })
  }
  //B)RENDER website
  return  res.status(err.statusCode).render('error',{
      title:'Something went to wrong',
      msg:err.message
    })
}

const sendErrorPro=(err,req,res)=>{
  //A)API
  if(req.originalUrl.startsWith('/api')){
     //operational, trusted error:send message to client
    if(err.isOperational){
      return res.status(err.statusCode).json({
        status:err.status,
        message:err.message
      })
    }
    //Programming or other unknown error:don't leak the error details
    //1)Log error
    console.error('Error: ',err)
  
    //2)send a generic message
    return res.status(500).json({
        status:'error',
        message:'Something went to wrong'
      })
  }
  //B)RENDER website
  if(err.isOperational){
     //operational, trusted error:send message to client
    return  res.status(err.statusCode).render('error',{
      title:'Something went to wrong',
      msg:err.message
    })
  }
  //Programming or other unknown error:don't leak the error details
    //1)Log error
  console.error('Error: ',err)

    //2)send a generic message
  return  res.status(err.statusCode).render('error',{
    title:'Something went to wrong',
    msg:'Please try again later!'
  })
}

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500
    err.status=err.status|| 'error'

    if(process.env.NODE_ENV.trim() ==='development'){
      sendErrorDev(err,req,res);
    }
    else if(process.env.NODE_ENV.trim() ==="production"){
      let error={...err,name:err.name}
      error.message=err.message
      if(error.name==='CastError')error=handleCastErrorDB(error)
      if(error.code===11000)error=handleDuplicateFieldsDB(error)
      if(error.name==='ValidationError')error=handleValidationErrorDB(error)
      if(error.name==='JsonWebTokenError')error=handleJWTError()
      if(error.name==='TokenExpiredError')error=handleJWTExpiredError()
      sendErrorPro(error,req,res)
    }
  }