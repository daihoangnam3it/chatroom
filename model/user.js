const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    nickname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    img:{
        type:String
    }
    
    

});
const User=mongoose.model('User',UserSchema);
module.exports=User;