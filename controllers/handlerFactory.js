const catchAsync=require('./../utils/catchAsync')
const appError=require('./../utils/appError')
const APIFeature=require('./../utils/apiFeatures')

exports.deleteOne=Model =>catchAsync( async (req, res,next) => {
    const doc=await Model.findByIdAndDelete(req.params.id)
    if(!doc){
      return next(new appError('No Document found with that id:',404))
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  
})

exports.updateOne = Model=>catchAsync(async (req, res,next) => {
  const doc=await Model.findByIdAndUpdate(req.params.id,req.body,{
    new: true,
    runValidators: true
  })
  if(!doc){
    return next(new appError('No document found with that id:',404))
  }
  res.status(200).json({
    status: 'success',
    data:{
      data:doc
    }
  });

});

exports.createOne=Model=>catchAsync(async (req, res,next) => {
  const doc = await Model.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    }
  });
})

exports.getOne=(Model,popOption)=>catchAsync( async (req, res,next) => {
  let query=Model.findById(req.params.id)
  if(popOption)query=query.populate(popOption)
  const doc=await query;

  if(!doc){
    return next(new appError(`No document found with that id:${req.params.id}`,404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      data:doc
    }
  });
});

exports.getAll=Model=>catchAsync(async (req, res,next) => {

  let filter={}
  if(req.params.tourId)filter={tour:req.params.tourId}
  const features=new APIFeature(Model.find(filter),req.query).filter().sort().limitField().paginate();
  const doc=await features.query
    res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data:doc
    }
  });
});