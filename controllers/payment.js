var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "zqvjb96p4g56mygw",
  publicKey: "6hgx649ckzqk2d3n",
  privateKey: "d9db90ac6930c2fc1634dde489196a6f"
});



exports.getToken = (req,res)=>{
    gateway.clientToken.generate({
      }, function (err, response) {
        if(err){
            res.status(500).send(err);
        }else {
            res.send(response);
        }
      });

}

exports.processPayment=(req,res)=>{
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if(err){
              res.status(400).json(err);
          }else{
              res.send(result);
          }
      });

}