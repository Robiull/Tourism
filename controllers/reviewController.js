const Review=require('./../models/reviewModels');
const factory=require('./handlerFactory')

exports.getAllReview=factory.getAll(Review)
exports.setTourUserIds=(req,res,next)=>{
    if(!req.body.tour)req.body.tour=req.params.tourId
    if(!req.body.user)req.body.user=req.user.id
    next()
}
exports.createReview=factory.createOne(Review)
exports.updateReview=factory.updateOne(Review)
exports.deleteReview=factory.deleteOne(Review)
exports.getReview=factory.getOne(Review)