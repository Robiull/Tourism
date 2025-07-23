const Tour=require('./tourModels')
const mongoose = require('mongoose');

const reviewSchema =mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review can not be empty!']
    },
    rating:{
        type:Number,
        max:[5,'A rating must be below 5'],
        min:[1,'A rating must be above 1']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'A review must belong to a tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A review must belong to a user']
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)

reviewSchema.index({tour:1,user:1},{unique:true})

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
    })
    next()
})
reviewSchema.statics.calcAverageRatings=async function(tourId){
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])
   if(stats.length>0){
        await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:stats[0].nRating,
        ratingsQuantity:stats[0].avgRating
    })
   }
   else{
        await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:4.5,
        ratingsQuantity:0
    })
   }
}
reviewSchema.post('save',function(){
    this.constructor.calcAverageRatings(this.tour)

})
reviewSchema.pre(/^findOneAnd/,async function(next){
    const reviw={}
    this.reviw=await this.findOne();
    next()
})

reviewSchema.post(/^findOneAnd/,async function(){
    //await this.findOne(); does not work here, query has already executed
   await this.reviw.constructor.calcAverageRatings(this.reviw.tour)
})
const Review=mongoose.model('Review',reviewSchema)
module.exports=Review