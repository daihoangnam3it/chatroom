const mongoose=require('mongoose');

const messSchema=new mongoose.Schema({
    content:{
        type:String,
    },
    iduser:{
        type:String,
        required:true
    },
    nameuser:{
        type:String,
        required:true
    },
    img:{
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});
const Mess=mongoose.model('Mess',messSchema);
module.exports=Mess;