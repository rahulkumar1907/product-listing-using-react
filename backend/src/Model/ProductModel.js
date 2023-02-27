const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const productSchema = new mongoose.Schema( {
    name:{
        type:String,
        required:true
    },
	price:{
        type:String,
        required:true,
        
    },
    company:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    userId:{
        type: ObjectId,
        required : true,
        ref:"user"
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema) 