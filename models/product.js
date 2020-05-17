const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema; 

const proSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		trim:true,
		maxlength:40
	},
	price:{
		type:Number,
		required:true
	},
	size:{
		type:String,
		
	},
	description:{
		type:String,
		
		maxlength:2000
	},
	category:{
       type:ObjectId,
       ref:"Category",
       required:true
	},
	stock:{
       type:Number,
	},
	sold:{
		type:Number,
		default:0
	},
	photo:{
		data: Buffer,
		contentType:String
	}

},{timestamps:true});

module.exports = mongoose.model("Product",proSchema);