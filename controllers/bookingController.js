const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tour=require('../models/tourModels');
const Booking=require('../models/bookingsModels');
const catchAsync=require('../utils/catchAsync')
const appError=require('../utils/appError')
const factory=require('./handlerFactory')

exports.getCheckoutSession=catchAsync(async(req,res,next)=>{
    //1)Get the currently booked tour
    const tour=await Tour.findById(req.params.tourId)

    //2)Create a checkout session
    const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode: 'payment',
        success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.id,
        line_items:[
            {
                price_data:{
                    unit_amount:tour.price*100,
                    currency:'usd',
                    product_data:{
                        name:`${tour.name} Tour`,
                        description:tour.summary,
                        images:[`https://natours.dev/img/tours/${tour.imageCover}`],
                    },
                },
                quantity:1
            }
        ]
    })
    res.status(200).json({
        status:'success',
        session
    })
})

exports.createBookingCheckout=catchAsync(async(req,res,next)=>{
    //This is temporary because it is unsecure:everyone can bookings without paying
    const {tour,user,price}=req.query
    if(!tour && !user && !price)return next()
    await Booking.create({tour,user,price})

    res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking=factory.createOne(Booking)
exports.getBooking=factory.getOne(Booking)
exports.getAllBookings=factory.getAll(Booking)
exports.deleteBooking=factory.deleteOne(Booking)
exports.updateBooking=factory.updateOne(Booking)