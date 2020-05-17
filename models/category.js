const mongoose = require('mongoose');
const catSchema = new mongoose.Schema(
    {
    	name:{
    		type:String,
    		maxlength:32,
    		required:true,
    		trim:true,
    		unique:true
    	},
    },{timestamps:true});

module.exports = mongoose.model("Category",catSchema);