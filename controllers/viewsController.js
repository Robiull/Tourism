const Tour= require('../models/tourModels')
const User= require('../models/userModels')
const Review=require('../models/reviewModels')
const Booking=require('../models/bookingsModels')
const catchAsync=require('../utils/catchAsync')
const appError=require('../utils/appError')


exports.getOverview=catchAsync(async(req,res,next)=>{
  
    const page = req.query.page * 1 || 1; 
    const limit = req.query.limit * 1 || 6; 
    const skip = (page - 1) * limit;
  
    const total = await Tour.countDocuments();
    const tours=await Tour.find().skip(skip).limit(limit);
    
    res.status(200).render('overview',{
      title: 'All Tour',
      tours,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    })
})

exports.getHomeView=catchAsync(async(req,res,next)=>{
    const tours=await Tour.find()

    const shuffled = tours.sort(() => 0.5 - Math.random());
    const randomThree = shuffled.slice(0, 3)

    for (let i = 0; i < randomThree.length; i++) {
        const slug = randomThree[i].slug;
        const populatedTour = await Tour.findOne({ slug }).populate({
          path: "reviews",
          select: "review rating user",
          populate: {
            path: "user",
            select: "name photo"
          }
        });
      
        randomThree[i] = populatedTour; // Replace or store as needed
      }

    res.status(200).render('home',{
      title: 'Home',
      tours:randomThree
    })
})

exports.getTour=catchAsync(async(req,res,next)=>{

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user"
    });

    if(!tour){
      return next(appError('There is a no tour that name',404))
    }
    const guideData=[]
    const len=tour.guides.length
    for(var i=0;i<len;i++){
        guideData.push(await User.findById(tour.guides[i]))
    }

    res.status(200).render('tour',{
      title:`${tour.name} tour`,
      tour,
      guideData
    })
})

exports.getLoginFrom=(req,res,next)=>{

  res.status(200).render('login',{
    title:'Log in'
  })
}

exports.getMyTour=async(req,res,next)=>{
  //1)Find all  bookings
  const bookings=await Booking.find({user:req.user.id})

  //2)Find tours with the returned ids
  const tourIds=bookings.map(el=>el.tour)
  const tours=await Tour.find({_id:{$in:tourIds}})

  res.status(200).render('overview',{
    title:'My Bookings',
    tours
  })
}

exports.getSignUpFrom=(req,res,next)=>{
    res.status(200).render('signUp',{
        title:'Sign Up'
    })
}
exports.getAccount=(req,res,next)=>{
    res.status(200).render('account',{
        title:'Your Account'
    })
}

exports.updateUserData=catchAsync(async(req,res,next)=>{
    const updatedUser=await User.findByIdAndUpdate(req.user.id,{
        name:req.body.name,
        email:req.body.email
    },
    {
        new:true,
        runValidators:true
    })

    res.status(200).render('account',{
        title:'Your Account',
        user:updatedUser
    })
})

exports.getForgotPasswordFrom=(req,res,next)=>{
    res.status(200).render('forgotPassword',{
        title:'Forgot your Password'
    })
}

exports.getResetPasswordForm=(req,res,next)=>{
    const token=req.params.token
    res.status(200).render('resetPassword',{
        title:'Reset Password',
        token
    })
}

exports.getGuidePage = (req, res) => {
    res.status(200).render("become-a-gudie", {
      title: "Become A Guide",
    });
  };
exports.getAboutPage = (req, res) => {
    res.status(200).render("about", {
      title: "Become A Guide",
    });
  };