const Hotel=require('../models/hotel')
const Order=require('../models/order')
const cloudinary = require('cloudinary');
const multer = require('multer');
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET

})
/**Multer */
/*********************** */
const storage=multer.diskStorage({})
const upload=multer({storage});
exports.upload=upload.single('image');
exports.pushToCloudinary =async (req,res,next)=>{
    if(req.file)
    {
        // Uploading file only if it is present
        
        await cloudinary.uploader.upload(req.file.path)
        .then((result)=>{
            req.body.image = result.public_id;
            //To 
            next()
        })
        .catch(()=>{
            req.flash('error','Sorry, there is some error while uploading your image, Please try again')
            res.redirect('/admin/add')
        })
    }else
    {
        next()
    }
}
/*********************** */


//Here exports is used so that this function homePage will be accessible to all the folder
exports.homePage=(req,res)=>{
    res.render('index',{title: 'Lets Travel'}) 


}
//For listing all hotels
exports.listAllHotels=async (req,res,next)=>{
    //This will fetch all the available data inside the collection hotels
    try{
        ///We are interested to fetch only those hotels which are available
        const hotels=await Hotel.find({available : {$eq : true}})
        res.render('all_hotels',{title: 'All Hotels',hotels}) 
        // res.json(hotels)
    }catch(error)
    {
        next(error)
    }
    
    //   
}
exports.listAllCountries=async (req,res,next)=>{
    try{
        const allCountries=await Hotel.distinct('country');
        res.render('all_countries',{title : 'Browse By Countries',allCountries})
    }catch(error)
    {
        next(error)
    }
}

exports.homePageFilters=async (req,res,next)=>{
    try
    {

        /**Now here both these await operation are executing one after other
         * but it is only useful when one operation is dependent on other
         * but here both these operation are independent so they can
         * they can be executed simultaneously so for this use Promise.all()
         * so that they can executed in one go
         */
        const hotels=/*await*/ Hotel.aggregate([
            { $match : {available : true}},
            {$sample : {size : 5}}
        ])
        const countries=/*await*/ Hotel.aggregate([
            {$group : {_id : '$country'}},
            {$sample : {size : 9}}
        ])
        /**Destucturing Array is used in fetching value from promise.all()
         * Lets take an example
         *          const food=['cheese','fish','rice']
         *          const [a,b,c] = food;
         * 
         * 
         * 
        */
        const [filteredCountries, filteredHotels]=await Promise.all([countries,hotels])
        

        res.render('index',{filteredCountries,filteredHotels});
    }catch(error)
    {
        next(error)
    }

}

exports.adminPage=(req,res)=>{
    res.render('admin',{title: 'Admin'});
}

exports.createHotelGet=(req,res)=>{
    res.render('add_hotel',{title:'Add new Hotel'})
}
exports.createHotelPost=async (req,res)=>{
    //First looking what kind of data we are working with
    //We can see what data has been sent by form using res.json()
    // res.json(req.body)
    try{
        const hotel=new Hotel(req.body)
   await hotel.save()
   req.flash('success',`${hotel.hotel_name} created successfully`);
   res.redirect(`/all/${hotel._id}`)
    }catch(error)
    {   
        next(error)
    }
   

}
/**Edit and Remove */

exports.editRemoveHotelGet= async(req,res,next)=>{
    try
    {
        res.render('edit_remove',{title:'Search for Hotel to Edit and Remove'})
    }catch(error)
    {
        next(error)
    }

}
exports.editRemoveHotelPost= async(req,res,next)=>
{
    try{

        /**Getting the content from form if hotelName is only given then hotelId will be made null and vice versa */
        const hotelId=req.body.hotel_id || null;
        const hotelName = req.body.hotel_name || null;
        /**Trying to get the hotel data either by hotelId or hotelName  using 'or' operator  of mongodb*/
        const hotelData=await Hotel.find({
            $or: [
                {_id: hotelId},
                {hotel_name: hotelName}
            ]
            /**collation is used to perform language specific matches and strengthe
             * here is an optional parameter where value of its 2 used to perform secondary level
             * search where it ignores the cases(i.e allows both upper and lower cases)
            */
        }).collation({
            locale: 'en',
            strength : 2
        });
        if(hotelData.length > 0)
        {
            // res.json(hotelData)
            res.render('hotel_detail',{title: 'Edit/Remove Hotel', hotelData})
            return 
        }
        else
        {
            req.flash('info',"No matches were found...");
            res.redirect('/admin/edit-remove')
        }
    }catch(error)
    {
        next(error)
    }
}

exports.updateHotelGet= async (req,res,next)=>{
    try{
        const hotel= await Hotel.findOne({_id: req.params.hotelId})
        res.render('add_hotel',{title: 'Update hotel', hotel})
    }catch(error)
    {
        next(error)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    }
}

exports.updateHotelPost= async (req,res,next)=>{
    try
    {
        const hotelId=req.params.hotelId;
        const hotel=await Hotel.findByIdAndUpdate(hotelId,req.body, {new:true});
        req.flash('success', `${hotel.hotel_name} updated successfully`)
        res.redirect(`/all/${hotelId}`)
    }   catch(error)
    {
        next(error)
    }
}

exports.deleteHotelGet= async (req,res,next)=>{
    
    try
    {
        const hotelId=req.params.hotelId;
        const hotel=await Hotel.findOne({_id : hotelId})
        res.render('add_hotel',{title: 'Delete Hotel',hotel})
    
    }catch(error)
    {
        next(error)
    }
  
}

exports.deleteHotelPost= async(req,res,next)=>{
    try
    {
        const hotelId=req.params.hotelId;
        await Hotel.deleteOne({_id : hotelId})
        req.flash('info',`Hotel ID: ${hotelId} deleted successfully`)
        res.redirect('/')
    }catch(error)
    {
        next(error)
    }
   
}

exports.hotelDetail=async(req,res,next)=>{
    try{
        const hotelParam=req.params.hotel;
        const hotelData=await Hotel.find({_id: hotelParam})
        res.render('hotel_detail',{title: 'Lets-travel', hotelData, name : 'Anurag'})
    }catch(error)
    {
        next(error)
    }
}

/**Displaying hotels by country */
exports.hotelByCountry=async (req,res,next)=>{
    try{
        const countryParam=req.params.country
        const countryList=await Hotel.find({country:countryParam})
        res.render('hotels_by_country',{title: `Browse by country : ${countryParam}`,countryList})
    }catch(error)
    {
        next(error)
    }
}
exports.searchResults=async (req,res,next)=>{
    try
    {
        const searchQuery=req.body;
        //Passing another argument as or 1 for handelling the case when a hotel is booked after clikcing on a particular hotel rather than searching for hotel
        const parsedStars=parseInt(searchQuery.stars) || 1
        const parsedSort=parseInt(searchQuery.sort)    || 1
        const searchData=await Hotel.aggregate([
            // Here `\"${searchQuery.destination}\"` means that we are taking the input in destination field as a single string and only that results will be returned which matches the complete string
            // This is done to prevent the situation where on searching for Hotel 1 will give all the hotels as result because every hotel consists of word Hotel in it
            {$match: {$text: {$search: `\"${searchQuery.destination}\"`}}},
            {$match: {available:true,star_rating: {$gte: parsedStars}}},
            {$sort: {cost_per_night: parsedSort}}
        ])
        // res.json(searchData)
        res.render('search_results',{title:'Search Results',searchQuery,searchData})
    }catch(error)
    {
        next(error)
    }
}
exports.viewBookings=async (req,res,next)=>{
    try{
            const orders= await Order.aggregate([
                {$lookup : {
                    from : 'hotels',
                    localField :'hotel_id',
                    foreignField :'_id',
                    as : 'hotel_data'
                }}
            ])
            // res.json(orders)
            res.render('view_bookings',{title : 'All Orders',orders})
    }catch(error)
    {
        next(error)
    }
}
/*

*Practice */

/**-------------------------------------------------------------------------------------------------------------------------------------------- */
// exports.admin2Page=(req,res)=>{
//     res.render('admin2',{title:'Admin'})
// }

// exports.addHotelGet=(req,res)=>{
//     res.render('add_hotel2',{title:'Add Hotel'})
// }
// exports.addHotelPost=async (req,res)=>{
//     try
//     {
//         const hotel=new Hotel(req.body)
//         await hotel.save()
//     }catch(error)
//     {
       
//     }
    
// }
/**-------------------------------------------------------------------------------------------------------------------------------------------- */

/**
 * Req : data coming from client
 * Res : data going from server
 * Middleware : Manipulating data in between
 */

 //Middleware
/** 
 * Problem Statement : Given two functionalities SignUp and Login
 * Now how to determine that signUp should come up first and
 * then login
 * So for that inside the signUp function use another param
 * next : which will guide what to execute next
*/
 