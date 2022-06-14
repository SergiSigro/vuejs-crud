var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var PRODUCTS_FILE = path.join(__dirname, 'src/assets/js/components/product-data.json');
var CART_FILE = path.join(__dirname, 'src/assets/js/components/cart.json');
var CITY_FILE = path.join(__dirname,'src/assets/js/components/city.json');


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

app.get('/api/city', function(req, res){
    fs.readFile(CITY_FILE, function(err, data){
        if(err){
            console.err(err);
            process.exit(1);
            res.json({msg:'error'});
        }else{
            let cities = JSON.parse(data);
            res.json({msg:'success', data:cities});
        }
        
    })
})

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

app.get('/api/cart', function(req, res) {

    fs.readFile(CART_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        var json = JSON.parse(data);

        res.json(json);
        
    });
});

app.post('/api/product/buy/:id', function(req, res) {

    fs.readFile(CART_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var cart = JSON.parse(data);
        let found = false;
        
        if(cart.length >= 1){
            for(var i = 0; i <= cart.length; i++){
                if(cart[i]['id'] == req.params.id){
                    found = true;
                    cart[i].qty += req.body.qty;
                    fs.writeFile(CART_FILE, JSON.stringify(cart, null, 4), function(err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        res.json(cart);
                    });
                    break;
                }
            }
        }
        if(!found){
            var newBuy = {
                id: req.body.id,
                name: req.body.name,
                price: req.body.price,
                qty: req.body.qty,
            };
            cart.push(newBuy);
            fs.writeFile(CART_FILE, JSON.stringify(cart, null, 4), function(err) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                res.json(cart);
            });
        }  
    });
});

app.patch('/api/product/edit/:id', function(req, res) {
    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var products = JSON.parse(data);

        for(var i = 0; i <= products.length; i++)
        {
            if(products[i]['id'] == req.params.id)
            {
                products[i].name = req.body.name;
                products[i].price = req.body.price;


                fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(products);
                });
                break;
            }
        }
    });
});

app.delete('/api/product/delete/:id', function(req, res) {
    fs.readFile(PRODUCTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var products = JSON.parse(data);

        for(var i = 0; i <= products.length; i++)
        {
            if(products[i]['id'] == req.params.id)
            {
                products.splice(i, 1);

                fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 4), function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    res.json(products);
                });
                break;
            }
        }
    });
});


app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});