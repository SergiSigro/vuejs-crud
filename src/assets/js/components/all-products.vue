<template>
    <div id="all-products">
        <h1>Products from {{ city }} </h1>

        <div class="form-group">
            <input type="text" name="search" v-model="productSearch" placeholder="Search products" class="form-control" v-on:keyup="searchProducts">
        </div>

        <table class="table table-hover">
            <thead>
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Price</td>
                <td>Actions</td>
            </tr>
            </thead>

            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.price }}</td>
                    <td style="width:120px">QTY:
                        <input v-model="product.qty" class="form-control input-qty" type="number" min="1">
                    </td>
                    <td>
                        <button @click="addToCart(product)" class="btn btn-primary">Buy</button>
                    </td>
                    <td>
                        <router-link :to="{name: 'cart', params: { cartProducts: cartProducts }}" class="btn btn-primary">Cart</router-link>
                        <router-link :to="{name: 'edit_product', params: { id: product.id }}" class="btn btn-primary">Edit</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    
    export default{
        props: ['city'],

        data(){
            return{
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
            },
            getCartProducts: function(){
                let cart = this.$route.params.cartProducts
                if(!isNaN(cart)){
                    this.cartProducts = cart
                }
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
            addToCart: function(productToAdd){

                // Add the item or increase qty
                let productInCart = this.cartProducts.filter(product => product.id===productToAdd.id);
                let isProductInCart = productInCart.length > 0;

                if (isProductInCart === false) {
                    
                    this.cartProducts.push(productToAdd);
                } else {
                    productInCart[0].qty += productToAdd.qty;
                    
                }
                this.$http.post('http://localhost:3000/api/product/buy/' + productToAdd.id, productToAdd, {
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }).then((response) => {
                    this.notifications.push({
                        type: 'success',
                        message: 'Product created successfully'
                    });
                }, (response) => {
                    this.notifications.push({
                        type: 'error',
                        message: 'Product not created'
                    });
                });
                productToAdd.qty = 1;
            },
            goToCart: function(){

            }
        }
    }
</script>
