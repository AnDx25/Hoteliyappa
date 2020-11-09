const mongooose=require('mongoose')

const orderSchema=new mongooose.Schema({
    user_id :{
        type : String,
        required : true
    },
    hotel_id :{
        type: mongooose.Schema.Types.ObjectId
    },
    order_details :{
        type: Object,
        required :true
    }
});

module.exports =mongooose.model('Order',orderSchema)