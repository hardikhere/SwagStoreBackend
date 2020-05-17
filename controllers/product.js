const Product = require("../models/product");

const formidable = require("formidable");
const fs=  require('fs');
const _ = require('lodash'); 
exports.getProductById = (req,res,next,id)=>{
        Product.findById(id)
        .populate("category")
        .exec((err,pro)=>{
      if(err){
      	return res.status(400).json({
      		err:"product not found"
      	});
      }
      req.product = pro;
      next();
   });      
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
    //destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }

    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
      product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: err
        });
      }
      res.json(product);
    });
  });
};

exports.showProductById=(req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
};
exports.updateProduct=(req,res)=>{
	 let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
   

    //updation code
    let product = req.product;
    product=_.extend(product,fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          error: "updation of tshirt in DB failed"
        });
      }
      res.json(product);
    });
  });
};
exports.showAllProducts =(req,res)=>{
   let limit = req.query.limit ?parseInt(req.query.limit): 10;
   let sortBy = req.query.sortBy?req.query.sortBy:"_id";
   Product.find({})
   .select("-photo")
   .populate("category")
   .sort([[sortBy,"asc"]])
   .limit(limit)
   .exec((err,products)=>{
       if(err){
       	 res.status(400).json({
       	 	err:"connot get product list"
       	 });;
       }
       res.json(products);
   });
};

exports.deleteProduct =(req,res)=>{
	Category.deleteOne( { _id:req.product._id } ).exec((err,pro)=>{
           if(err)return res.status(400).json({
           	err:"cannot delete product"
           });
           	res.json({
           		msg:"product deleted"
           	});
	});

};

exports.photo = (req,res,next)=>{
   if(req.product.photo.data){
    res.set("Content-Type",req.product.photo.contentType);
    return res.send(req.product.photo.data);
   }
   next();
};

exports.updateStock = (req,res,next)=>{
       let myOperation = req.body.order.products.map(prod=>{
         return {
             updateOne:{
               filter:{_id:prod._id},
               update:{$inc :{
                 stock:-prod.count,
                 sold:+prod.count
               }
              }
             } 
        }
       });
       Product.bulkWrite(myOperation,{},(err,prod)=>{
              if(err){
                res.status(400).json({
                  err:"bulk operation failed"
                });
              }
              next();
       });
       
};

exports.getAllCategories =(req,res)=>{
    Product.distinct("category",{},(err,cat)=>{
          if(err){
            return res.status(400).json({
              err:"no category found"
            });
          }
          res.json(cat);
    })
};