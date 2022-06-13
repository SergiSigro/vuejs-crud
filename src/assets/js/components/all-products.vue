<template>
    <div id="all-products " >
        
        <h2>Products from {{ city.charAt(0).toUpperCase() + city.slice(1) }} </h2>

        <div class="panel panel-default " style="stylesheet">
            <div class="panel-heading"><b>RESULTS</b></div>
            <div class="panel-body ">
                <div class="row">
                <div class="col-sm-4" v-for="product in products" :key="product.id">
                    <img src="../../img/test_coffee.jpg" alt="Avatar" style="width:50%">
                    <h4><b>{{product.name}}</b></h4>
                    <p>{{product.price}}</p>
                    <p class="text-center"><input v-model="product.qty" type="number" class="form-control" placeholder="Qty" min="1"/></p>
                    <button @click="addToCart(product)" class="btn btn-sm btn-primary" style="margin-bottom: 10px"><span class="glyphicon glyphicon-shopping-cart"></span> Add to Cart</button>
                </div>
                </div>
            </div>
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
                cartProducts: [],
                productSearch: ''
            }
        },

        created: function()
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
            },
            
            addToCart: function(product){
                let found = false;

                // Add the item or increase qty
			    let itemInCart = this.cartProducts.filter(item => item.id===product.id);
			    let isItemInCart = itemInCart.length > 0;

                if (isItemInCart === false) {
                    product.total = product.qty * product.price;
                    this.cartProducts.push(product);
                } else {
                    itemInCart[0].qty += product.qty;
                    itemInCart[0].total = itemInCart[0].qty * product.price;
                }
			    product.qty = 1;
                this.$store.commit("updateStoreCartProducts", this.cartProducts)
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
        }
    }
</script>
