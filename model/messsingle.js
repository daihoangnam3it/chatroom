const mongoose=require('mongoose');

const messSSchema=new mongoose.Schema({
    iduserone:{
        type:String,
        required:true
    },
    idusertwo:{
        type:String,
        required:true
    },
    content:{
        type:Array,
    }

    

});
const MessS=mongoose.model('MessP',messSSchema);
module.exports=MessS;