require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

//my routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');



//db connection
try{
mongoose.connect(process.env.DATABASE,
{ useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
})
.then(()=>{
       console.log("db connected");
});
}catch(err){
     console.log("db not connected");
};

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
//my routs
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);
app.use("/api",paymentRoutes);

app.get('/index', function(req,res) {
     res.sendfile('public/index.html');
   });

//port 
const port = process.env.PORT || 8000;
//starting a server
app.listen(port,()=>{
	console.log(`app is running at ${port}`);
});

