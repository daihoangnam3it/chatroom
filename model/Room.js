const mongoose =require('mongoose');

const roomSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    user:{
        type:Array,
        required:true,
    },
    content:{
        type:Array
    }
})

const Room=mongoose.model('Room',roomSchema);
module.exports=Room;