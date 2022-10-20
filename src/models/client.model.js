const mongoose = require('mongoose');
const clientSchema = new mongoose.Schema({
    CLABE: {
        type:Number,
        required:true,
         unique:true,
    },
    name: {
        type:String
    },
    email:{
        type:String,
        unique:true
        },
    amount:{
        type:mongoose.Schema.Types.Decimal
        },
    isActive:{
        type:Boolean,
        default:true
    },
    created_at:{
        type:String,
        default:new Date().toUTCString()
    },
    updated_at:{
        type:String,
        default:new Date().toUTCString()
    }
});
module.exports = mongoose.model('client',clientSchema);