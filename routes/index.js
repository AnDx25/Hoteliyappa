var express = require('express');
var router = express.Router();

/* GET home page.(Without Controller) */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Anurag' });
// });

/* GET home page.(Without Controller) */
//require controllers
const hotelController=require('../controllers/hotelController')
const userController=require('../controllers/userController')
router.get('/',hotelController.homePageFilters)
/**Checking if session is working or not*/
/********************************************** */
// router.get('/',function(req,res){
//   if(req.session.page_views)
//   {
//     req.session.page_views++;
//     res.send((`Number of page visits : ${req.session.page_views}`))
//   }
//   //else part will handel if user is visiting for the first time
//   else
//   {
//     req.session.page_views=1;
//     res.send('First visit');
//   }

// })
/************************************************************* */
/**Handelling See All hotels link */
router.get('/all',hotelController.listAllHotels);
router.get('/all/:hotel',hotelController.hotelDetail)

/**Handelling the Countries links */
router.get('/countries',hotelController.listAllCountries);
//In order to handel when a particular coutry is clicked
router.get('/countries/:country',hotelController.hotelByCountry)
router.post('/results',hotelController.searchResults)
/**Here ':' is used to make the hotelId dynamic */
router.get('/admin/:hotelId/update',hotelController.updateHotelGet)
router.get('/admin/:hotelId/update',hotelController.updateHotelPost)
/**Route Parameters
 * Handelling dynamic links
 */

// router.get('/all/:name',function(req,res){
  
//   const name=req.params.name
//   res.render('all_hotels',{title: 'All Hotels', name});
// });
/**Inorder to accept any amount of data */
// router.get('/all/*/',function(req,res){
  
// })
 /**
  * Sending string of hello to the browser
  * and not rendering any file
  */
  // res.send('Hello Anurag')

//This will execute the signUp and login in sequence
// router.get('/sign-up',hotelController.signUp,hotelController.logIn)

// //Incase we directly need login no any signup

// router.get('log-in',hotelController.logIn)


//ADMIN ROUTES;

router.get('/admin',userController.isAdmin, hotelController.adminPage);
router.get('/admin/*',userController.isAdmin);
router.get('/admin/add',hotelController.createHotelGet)
router.post('/admin/add',hotelController.upload,
hotelController.pushToCloudinary,
hotelController.createHotelPost)

router.get('/admin/edit-remove',hotelController.editRemoveHotelGet)
router.post('/admin/edit-remove',hotelController.editRemoveHotelPost)

router.get('/admin/:hotelId/update',hotelController.updateHotelGet)
router.post('/admin/:hotelId/update',hotelController.upload,
hotelController.pushToCloudinary,
hotelController.updateHotelPost)

router.get('/admin/:hotelId/delete',hotelController.deleteHotelGet)
router.post('/admin/:hotelId/delete',hotelController.deleteHotelPost)

router.get('/admin/orders',hotelController.viewBookings)

/**Doing practice  */
/************************************ */
// router.get('/admin',hotelController.admin2Page)
// router.get('/admin/add',hotelController.addHotelGet)
// router.post('/admin/add',hotelController.addHotelPost)

/**Authentication Links */

router.get('/sign-up',userController.signUpGet)
router.post('/sign-up',
userController.signUpPost,
// Now we want that after registering it got redirected to login
userController.loginPost
)
router.get('/login',userController.loginGet);
router.post('/login',userController.loginPost)
router.get('/logout',userController.logoutGet)
router.get('/confirmation/:data',userController.bookingConfirmation)
router.get('/order-placed/:data',userController.orderPlaced)
router.get('/my-account',userController.myAccount);
module.exports = router;