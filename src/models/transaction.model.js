const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    clabeOrigin: {
        type:Number,
        required:true
    },
    lastAmountOrigin:{
        type:mongoose.Schema.Types.Decimal,
        required:true
    },
    newAmountOrigin:{
        type:mongoose.Schema.Types.Decimal,
        required:true
    },
    clabeDestination: {
        type:Number,
        required:true
    },
    lastAmountDestination:{
        type:mongoose.Schema.Types.Decimal,
        required:true
    },
    newAmountDestination:{
        type:mongoose.Schema.Types.Decimal,
        required:true
    },
    amount: {
        type:mongoose.Schema.Types.Decimal
    },
    created_at:{
        type:String,
        default:new Date().toUTCString()
    }
});
module.exports = mongoose.model('transaction',transactionSchema);


