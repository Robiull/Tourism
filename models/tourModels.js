const mongoose = require('mongoose');
const slugify =require('slugify')

const tourSchema=mongoose.Schema({
    name:{
      type:String,
      required:[true,'A tour must have a name'],
      unique:true,
      trim:true,
      maxlength:[60,'A tour name must have less or equal then 60 characters'],
      minlength:[10,'A tour name must have more or equal then 10 characters'],
    },
    slug:String,
    price:{
      type:Number,
      required:[true,'A tour must have a price'],
      min:[100,'Price must be at least 100']
    },
    priceDiscount:{
      type:Number,
     validate:{
      validator:function(val){
        return val<this.price
      },
      message:'Price Discount ({VALUE}) should be below regular price'
     }
      
    },
    duration:{
      type:Number,
      required:[true, 'A tour must have a duration']
    },
    ratingsAverage:{
      type:Number,
      default:4.5,
      min:[1,'Rating must be above 1.0'],
      max:[5,'Rating must be below 5.0'],
      set:val=>Math.round(val*10)/10
    },
    ratingsQuantity:{
      type:Number,
      default:0
    },
    discount:{
      type:Number,
      default:0
    },
  
    description:{
      type:String,
      trim:true
    },
    summary:{
      type:String,
      trim:true,
      require:[true, 'A tour must have a description']
    },
    maxGroupSize:{
      type:Number,
      required:[true, 'A tour must have a group size']
    },
    imageCover:{
      type:String,
      required:[true, 'A tour must have a cover image']
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now(),
      select:false
    },
    startDates:[Date],
    difficulty:{
      type:String,
      required:[true,'A tour must have a difficulty'],
      enum:{
        values:['easy','medium','difficult'],
        message:'Difficulty is either :easy,medium,difficult'
      }
    },
    secretTour:{
      type:Boolean,
      default:false
    },
    startLocation:{
      type:{
        type:String,
        default:"Point",
        enum:['Point']
      },
      coordinates:[Number],
      address:String,
      description:String
    },
    locations:[
      {
        type:{
          type:String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    ],
    guides:[
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  }
)
tourSchema.index({price:1,ratingsAverage:-1})
tourSchema.index({slug:1})
tourSchema.index({startLocation: "2dsphere"})

//virtual properties of database
  tourSchema.virtual('durationWeek').get(function(){
    return this.duration/7
  })

  //virtual populate
  tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
  })
// mongoose DOCUMENT MIDDLEWARE: runs before .save() and .create()

tourSchema.pre('save',function(next){
  this.slug=slugify(this.name,{lower:true})
  next();
})

tourSchema.pre(/^find/,function(next){
  this.find({secretTour:{$ne:true}})
  this.start=Date.now()
  next();
})
//Reference Model
tourSchema.pre(/^find/,function(next){
  this.populate({
    path:'guide',
    select:'-__v -passwordChangedAt'
  })
  next()
})


tourSchema.post(/^find/,function(docs,next){
  console.log(`Query took ${Date.now()-this.start} milliseconds`)
  next();
})
  
const Tour=mongoose.model('Tour',tourSchema);
  
module.exports=Tour;