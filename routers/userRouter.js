const express=require('express')

const userController=require('../controllers/userController');
const authController=require('../controllers/authController');


const router=express.Router();

router.post('/signup',authController.signUp)
router.post('/login',authController.login)
router.get('/logout',authController.logOut)
router.post('/forgotPassword',authController.forgotPassword)
router.patch('/resetPassword/:token',authController.resetPassword)


router.use(authController.protect)

router.get('/me',userController.getMe,userController.getUser)
router.patch('/updateMyPassword',authController.updatePassword)
router.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe)
router.delete('/deleteMe',userController.deleteMe)

//Restrict for the administrator
router.use(authController.restrictTo('admin'))

router
    .route('/')
    .get(userController.getAllUser)
    .post(userController.createUser)
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports=router;
