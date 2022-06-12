<template>
    <div id="all-products " >
        
        <h2>Products from {{ city.charAt(0).toUpperCase() + city.slice(1) }} </h2>

        <div class="panel panel-default " style="stylesheet">
            <div class="panel-heading"><b>RESULTS</b></div>
            <div class="panel-body ">
                <div class="row" >
                <div class="col-sm-4" v-for="product in products" :key="product.id">
                    <img src="../../img/test_coffee.jpg" alt="Avatar" style="width:50%">
                    <h4><b>{{product.name}}</b></h4>
                    <p>{{product.price}}</p>
                    <a href="#cart_button" class="btn btn-info btn-lg" style="margin-bottom: 10px">
                        <span class="glyphicon glyphicon-shopping-cart"></span> Add to Cart
                    </a>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import deleteProduct from './delete-product.vue';

    export default{
  components: { deleteProduct },
        props: ['city'],

        data(){
            return{
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
            }
        }
    }
</script>
