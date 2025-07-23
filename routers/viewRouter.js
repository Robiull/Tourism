const express=require('express')
const router=express.Router()

const viewsController=require('../controllers/viewsController')
const authController=require('../controllers/authController')
const bookingController=require('../controllers/bookingController')

router.get('/home',viewsController.getHomeView)
router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn,viewsController.getOverview)
router.get('/overview',authController.isLoggedIn,viewsController.getOverview)
router.get('/my-tours',authController.protect,viewsController.getMyTour)
router.get('/tour/:slug',authController.isLoggedIn,viewsController.getTour)


 router.get('/forgotPassword',viewsController.getForgotPasswordFrom)
 router.get('/me',authController.protect,viewsController.getAccount)
 router.get('/api/v1/user/resetPassword/:token',viewsController.getResetPasswordForm)

router.use(authController.isLoggedIn)

router.get('/login',viewsController.getLoginFrom)
 router.get('/singUp',viewsController.getSignUpFrom)
router.get('/become-a-guide',viewsController.getGuidePage)
router.get('/about',viewsController.getAboutPage)

module.exports=router