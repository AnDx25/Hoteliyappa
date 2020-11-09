const mongoose=require('mongoose')
const passportLocalMongoose=require('passport-local-mongoose');
const mongooseBcrypt=require('mongoose-bcrypt');

const userSchema=new mongoose.Schema({
    first_name :{
        type: String,
        required : "First Name is required",
        trim: true,
        max: 30
    },
    last_name: {
        type: String,
        required: "Last name is required",
        trim : true,
        max: 30
    },
    email :{
        type: String,
        required: "Email is required",
        trim: true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : 'Password is required',
        bcrypt: true

    },
    isAdmin : {
        type: Boolean,
        default : false
    }
});
userSchema.plugin(passportLocalMongoose,{usernameField: 'email'})
userSchema.plugin(mongooseBcrypt)
module.exports=mongoose.model('User', userSchema)