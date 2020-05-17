const Category = require("../models/category");
exports.getCategoryById = (req,res,next,id)=>{
   Category.findById(id).exec((err,cat)=>{
      if(err){
      	return res.status(400).json({
      		err:"category not found"
      	});
      }
      req.category = cat;
      next();
   });
   
};

exports.createCategory = (req,res)=>{
     let cat = new Category(req.body);
     cat.save((err,cat)=>{
          if(err) return res.status(400).json({
          	err:"category not created or already exists"
          });
          	const {name} = cat;
          	return res.json({name:name});
     });
};
exports.getAllCategory = (req,res)=>{
     Category.find({}).exec((err,catgs)=>{
          if(err)return res.status(400).json({
          	err:"cannot get categories"
          });
          let {name}=catgs;
          return res.json(catgs);
     });
};

exports.getCategory = (req,res)=>{
  return res.json(req.category);
};
exports.updateCategory = (req,res)=>{
       Category.findOneAndUpdate({_id:req.category._id},
    	{$set:req.body},{new:true}).exec((err,cat)=>{
            if(err || !cat){ return res.status(400).json({
               err:"update unsucessfull"
            }); 
               }
	        return res.json(cat);
    	} );
};
exports.deleteCategory =(req,res)=>{
	Category.deleteOne( { _id:req.category._id } ).exec((err,cat)=>{
           if(err)return res.status(400).json({
           	err:"cannot delete category"
           });
           	res.json({
           		msg:"item deleted"
           	});
	});

};