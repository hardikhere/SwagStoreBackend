const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
      product:{
      	type:ObjectId,
      	ref:"product"
      },
      name:String,
      count:Number,
      price:Number
});

const productCart = mongoose.model("productCart",productCartSchema);

const OrderSchema = new mongoose.Schema({
	products:[productCartSchema],
	transaction_id :{},
	amount:{type:Number},
	address:String,
	status:{
		type:String,
		default:"recieved",
		enum:["cancelled","delivered","processing","recieved"]
	},
	updated:Date,
	user:{
		type:ObjectId,
		ref:"User"
	}
},{timestamps:true});

const Order = mongoose.model("Order",OrderSchema);
module.exports = {Order,productCart};