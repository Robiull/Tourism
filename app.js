const path=require('path')
const express=require('express')
const morgan = require('morgan')
const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const mongoSanitize=require('express-mongo-sanitize')
const xss=require('xss-clean')
const hpp= require('hpp')
const cookieParser=require('cookie-parser')
const compression=require('compression')

const AppError=require('./utils/appError')
const globalErrorHandler=require('./controllers/errorController')

const tourRoute=require('./routers/tourRouter')
const userRoute=require('./routers/userRouter')
const reviewRoute=require('./routers/reviewRouter')
const bookingRoute=require('./routers/bookingRouter')
const viewRoute=require('./routers/viewRouter')

const app=express()

app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'))
}
const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many request from this IP. Please try again later in an hour'
})

app.use('/api',limiter)

//Body parser and reading data from body req.body
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit:'10kb'}))
app.use(cookieParser())

//Data sanitize against NoSQL query injection
app.use(mongoSanitize())

//Data sanitize against XSS
app.use(xss())


//Prevent Parameter Pollution
app.use(hpp({
  whitelist:['duration','ratingsAverage','ratingsQuantity','maxGroupSize','difficulty','price']
}))

app.use(compression())
  //Test Middleware 
  app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
  })
  
app.use('/',viewRoute)
app.use('/api/v1/tours',tourRoute)
app.use('/api/v1/user',userRoute)
app.use('/api/v1/review',reviewRoute)
app.use('/api/v1/bookings',bookingRoute)


app.all('*',(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404))
})
app.use(globalErrorHandler)
module.exports=app;