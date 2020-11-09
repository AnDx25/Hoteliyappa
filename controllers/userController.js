const User=require('../models/user');
const Hotel=require('../models/hotel')
const Order =require('../models/order')
const Passport = require('passport')
//Express Validator

//It checks for the error and store results in validadtionResult
const {check,validationResult}=require('express-validator/check')
const {sanitize}=require('express-validator/filter')

const querystring = require('querystring');
exports.signUpGet=(req,res,next)=>{
    try{
        res.render('sign-up',{title: 'user sign up page'})
    }catch(error)
    {
        next(error)
    }
}
exports.signUpPost=[
    //Validate the data
    check('first_name').isLength({min:1}).withMessage('First name must be specified')
    .isAlphanumeric().withMessage('First name must be alphanumeric'),

    check('last_name').isLength({min:1}).withMessage('Last name must be specified')
    .isAlphanumeric().withMessage('Last name must be alphanumeric'),

    check('email').isEmail().withMessage('Invalid Email Address'),

    check('confirm_email')
    .custom((value,{req})=>value === req.body.email)
    .withMessage('Email addresses do not match'),

    check('password').isLength({min: 6})
    .withMessage('Invalid password, password must be a minimum of 6 characters'),

    check('confirm_password')
    .custom((value,{req})=>value === req.body.password)
    .withMessage('Password do not match'),

    sanitize('*').trim().escape(),

    (req,res,next)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty())
        {
            //There are errors
            res.render('sign-up',{title : 'Please fix the following errors:',errors: errors.array()});
            // res.json(req.body)
            return;
        }
        else
        {
            //No errors
            const newUser=new User(req.body)
            User.register(newUser,req.body.password,function(err)
            {
                if(err)
                {
                    console.log("error while registering",err)
                    return next(err)
                }
                next() //It will move to next instruction of moving to loginPost action which is mentioned in signUpPost routes in index.js and thus redirecting to home page aster signup successfully
            })
        
        }

    }
]

exports.loginGet=(req,res,next)=>{
    try
    {
        res.render('login',{title: 'Login to continue'})

    }catch(error)
    {
        next(error)
    }

}


exports.loginPost = Passport.authenticate('local',{
    // Redirect to home page if login successfull
    successRedirect : '/', 
    successFlash: 'You are now logged in',
    //Redirect to same login page id login failed
    failureRedirect : '/login',
    failureFlash : 'Login failed, please try again'

});

exports.logoutGet=(req,res)=>{
    req.logout()
    req.flash('info','You are now logged out')
    res.redirect('/')
}

exports.isAdmin=(req,res,next)=>{
   
    if(req.isAuthenticated() && req.user.isAdmin)
    {
        next();
        return;
    }
    res.redirect('/');
}

exports.bookingConfirmation=async(req,res,next)=>{
    try{
        const data=req.params.data;
        // converting the normal query string into json format
        const searchData=querystring.parse(data)
        const hotel = await Hotel.find({_id:searchData.id})
        res.render('confirmation',{title:"Confirm Booking", hotel,searchData} )

        // res.json(searchData)
    }catch(error)
    {
        next(error)
    }
}
exports.orderPlaced=async(req,res,next)=>{
    try
    {
        const  data=req.params.data;
        //converting the normal query string into json format
        const parsedData =querystring.parse(data)
       
        const order =new Order({
            user_id : req.user._id,
            hotel_id: parsedData.id,
            order_details :{
                duration: parsedData.duration,
                dateOfDeparture : parsedData.dateOfDeparture,
                numberOfGuests : parsedData.numberOfGuests

                
            }

        });
        await order.save()
        req.flash('info','Thank you, your order has been placed')
        res.redirect('/my-account');
    
    }catch(error)
    {
        next(error)
    }
}

exports.myAccount= async(req,res,next)=>{
    try{
        const orders = await Order.aggregate([
            {$match : {user_id : req.user.id}},

            // Now since we are in order collection and we need the data from hotel
            // collection so we need to use lookup
            {$lookup : {
                from : 'hotels',
                localField : 'hotel_id', //It is the field which is of current table that is order table
                foreignField : '_id', //It is id of the table from which we want to retrieve the tdata i..e hotels
                as : 'hotel_data' //Giving the name of the array in which our result will get store
            }}
        ])
        res.render('my_account',{title : 'My Account',orders})
    }catch(error)
    {
        next(error)
    }
    

    // res.render('my_account',{title : 'Your account'})
    

}
