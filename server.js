var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var paypal = require('paypal-rest-sdk')

var app = express();

var PRODUCTS_FILE = path.join(__dirname, 'src/assets/js/components/product-data.json');


app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/jquery',express.static(path.join(__dirname+'/node_modules/jquery/dist/')));


// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//PayPal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'YOUR CLIENT ID HERE',
    'client_secret': 'YOUR CLIENT SECRET HERE'
});

// start payment process
app.post('/cart/checkout' , (req , res) => {
    console.log(req.body);
    var execute_payment_json = {
      "payer_id": req.body.data.payerID,
    };
    const payment = {};
    payment.amount = req.body.data.amount;
    const paymentID = req.body.data.paymentID;
    paymentPaypal(paymentID, execute_payment_json, payment,(err, result) => {
        if(err) {
          res.status(400).json(JSON.stringify(err));
        } else {
          res.status(200).json(payment);
        }
    });
});

// helper functions
var paymentPaypal = (paymentID, execute_payment_json, payment, cb) => {
    paypal.payment.execute(paymentID, execute_payment_json,(error, paymentLog) => {
        if (error)
        {
            return cb(error);
        }
        else
        {
            // the server logic after successful payment
            // here just print out the payment information to the console
            payment.email = paymentLog.payer.payer_info.email;
            payment.first_name = paymentLog.payer.payer_info.first_name;
            payment.last_name = paymentLog.payer.payer_info.last_name;
            console.log(payment);
            cb(null, JSON.stringify(payment));
       }
    });
}



app.get('/api/products/:city', function(req, res) {
    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        let products = JSON.parse(data);
        res.json(products.filter(function(product){
            return product.city.toLowerCase() === req.params.city.toLowerCase()
        }));
    });
});


app.get('/api/product/:id', function(req, res) {

    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        var json = JSON.parse(data);

        for(var i = 0; i <= json.length; i++)
        {
            if(json[i]['id'] == req.params.id)
            {
                res.json(json[i]);
                break;
            }
        }
    });
});


app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});