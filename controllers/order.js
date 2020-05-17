const {Order,productCart} = require("../models/order");

exports.getOrderById = (req,res,next,id)=>{
   Order.findById(id)
   .populate("products.product","name price")
   .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                err:"no order found"
            });
        }
        req.order = order;
        next();
   });
};
exports.createOrder =(req,res)=>{
        req.body.order.user = req.profile;
        const order = new Order(req.body.order);
        order.save((err,order)=>{
            if(err){
                return res.status(400).json({
                    err:"failed to save order in DB"
                });
            }
            res.json(order);
        })
};
exports.getAllorders =(req,res)=>{
   Order.find({})
         .populate("user","_id name email")
         .exec((err,orders)=>{
             if(err){
                 return res.status(400).json(
                     {
                         err:"no order found in DB"
                     }
                 )
             }
             res.json(orders);
         });
};

exports.getStatus=()=>{
   res.json(Order.schema.path("status").enum);
};
exports.setStatus=()=>{
    Order.update(
        {_id:req.body.orderId},
        {$set:{status:req.body.status}},
        (err,Order)=>{
            if(err){
                return res.status(400).json({
                    err:"cannot update order Status"
                });
            }
            res.json(order);
        }
    );


};