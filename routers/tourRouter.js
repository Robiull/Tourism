const express=require('express')
const router=express.Router();
const tourController=require('../controllers/tourController')
const authController=require('../controllers/authController')
const reviewRouter=require('./reviewRouter')

router.use('/:tourId/reviews',reviewRouter)
router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTour)
router.route('/tour-stats').get(tourController.getTourStats)
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)
router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances)

router
    .route('/monthly-plan/:year')
    .get(authController.protect,
        authController.restrictTo('admin','lead-guide','guide'),
        tourController.getMonthlyPlan)


router
    .route('/')
    .get(tourController.getAllTour)
    .post(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.createTour)

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour)
    .delete(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.deleteTour)


module.exports=router;



