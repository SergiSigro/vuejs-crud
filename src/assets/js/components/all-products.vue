<template>
    <div id="all-products " >
        
        <h1 style="font-family: 'Brush Script MT', cursive;">{{ city.charAt(0).toUpperCase() + city.slice(1) }}'s store </h1>

        <div class="panel panel-success " v-if="products.length != 0" style="stylesheet">
            <div class="panel-heading"><b style="font-family: Brush Script MT; font-size: large;">Coffees:</b></div>
            <div class="panel-body " style="background: #E9EBE7;">
                <div class="row">
                <div class="col-sm-6 col-lg-4" v-for="product in products" :key="product.id">
                    <img :src="findImage(product)" style="width:50%">
                    <h4 style=" text-align: center;"><b style="color: white;font-family: Brush Script MT; font-size: xx-large;">{{product.name}} / {{product.type}}</b></h4>
                    <p id="description">{{product.description}}</p>
                    <p style="color: white; align-text: left;">{{product.time}}</p>
                    <p style="color: white;">{{product.price}}$</p>
                    <p class="text-center"><input v-model="product.qty" type="number" class="form-control" placeholder="Qty" min="1"></p>
                    <button @click="addToCart(product)" class="button" ><span class="glyphicon glyphicon-shopping-cart"></span> Add to Cart</button>
                </div>
                </div>
            </div>
        </div>
        <div class="panel panel-danger" v-else>
            <div class="panel-heading"><b style="font-family: Brush Script MT; font-size: xx-large;">Oops!</b></div>
            <div class="panel-body"><h4>Unfortunately we do not have any store in {{city.charAt(0).toUpperCase() + city.slice(1)}}.</h4></div>
        </div>
    </div>
</template>

<script>
    
    export default{
        props: ['city'],

        data(){
            return{
                cartProducts:[],
                products: [],
                originalProducts: [],
                productSearch: ''
            }
        },

        created: function()
        {
            this.fetchProductData();
        },
        updated: function()
        {
            this.fetchProductData();
        },
        
        methods: {
            fetchProductData: function()
            {
                this.$http.get('http://localhost:3000/api/products/' + this.city).then((response) => {
                    this.products = response.body;
                    this.originalProducts = this.products;
                    
                }, (response) => {

                });
                this.cartProducts = this.$store.state.cartProducts;
            },
            
            addToCart: function(product){
                let found = false;

                // Add the item or increase qty
                console.log(this.cartProducts);
			    let itemInCart = this.cartProducts.filter(item => item.id===product.id);
			    let isItemInCart = itemInCart.length > 0;

                if (isItemInCart === false) {
                    this.cartProducts.push(Object.assign({}, product));
                } else {
                    let qty = parseInt(product.qty)
                    itemInCart[0].qty = parseInt(itemInCart[0].qty) + qty;
                }
			    product.qty = 1;
                this.$store.commit("updateStoreCartProducts", this.cartProducts)
            },

            findImage:function(product){
                return require('../../img/'+ product.name + '.png')
            },

            searchProducts: function()
            {
                if(this.productSearch == '')
                {
                    this.products = this.originalProducts;
                    return;
                }

                var searchedProducts = [];
                for(var i = 0; i < this.originalProducts.length; i++)
                {
                    var productName = this.originalProducts[i]['name'].toLowerCase();
                    if(productName.indexOf(this.productSearch.toLowerCase()) >= 0)
                    {
                        searchedProducts.push(this.originalProducts[i]);
                    }
                }

                this.products = searchedProducts;
            },
        },
    }
</script>
