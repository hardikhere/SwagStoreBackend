const User  = require("../models/user");
const {Order}  = require("../models/order");
exports.getUserById = (req,res,next,id)=>{
   User.findById(id).exec((err,user)=>{
       if(err|| !user){
            return res.status(400).json({
            	err:"no user found in db"
            });
       }
       req.profile = user;
       next();
   });
};

exports.getUser=(req,res)=>{
	//todo get back here for pass
	req.profile.salt = undefined;
	req.profile.encry_password=undefined;
	req.profile.updatedAt=undefined;
	req.profile.createdAt=undefined;
      return res.json(req.profile);
};
exports.updateUser = (req,res)=>{
    User.findOneAndUpdate({_id:req.profile._id},
    	{$set:req.body},{new:true}).exec((err,user)=>{
            if(err || !user){ return res.status(400).json({
               err:"update unsucessfull"
            }); 
               }
            user.salt = undefined;
	        user.encry_password=undefined;
	        return res.json(user);
    	} );
    	
};
exports.userPurchaseList = (req,res)=>{
     Order.find({user:req.profile._id})
     .populate("user","_.id name")
     .exec((err,order)=>{
          if(err)return res.status(400).json({
          	err:"no order in this account"
          });
          	return res.json(order);
     });
};

exports.pushOrderPushaseList=(req,res,next)=>{
      let purchases = [];
      req.body.order.products.forEach((item)=>{
      	purchases.push({
      		_id:product._id,
      		name:product.name,
      		decription:product.decription,
      		category:product.category,
      		quantity:product.quantity,
      		amount :req.body.order.amount,
      		transaction_id:req.body.order.transaction_id
      	});
      });

      //store array in db
      User.findOneAndUpdate({_id:req.profile._id},
      	{$push:{purchases:purchases}},
      	{new:true},
      	(err,purchaseList)=>{
             if(err){
             	return res.status(400).json({
             		err:"unable to save purchase list"
             	})
             }
             next();
      	});
};
