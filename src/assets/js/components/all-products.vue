<template>
    <div id="all-products " >
        
        <h1>Products from {{ city }} </h1>

        <div class="panel panel-default " style="stylesheet">
            <div class="panel-heading">Products</div>
            <div class="panel-body">
                <div class="row" >
                <div class="col-sm-4" v-for="product in products" :key="product.id">
                    <img src="../../img/test_coffee.jpg" alt="Avatar" style="width:50%">
                    <h4><b>{{product.name}}</b></h4>
                    <p>{{product.price}}</p>
                </div>
                </div>
            </div>
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
                    <td>
                        <router-link :to="{name: 'edit_product', params: { id: product.id }}" class="btn btn-primary">Edit</router-link>
                        <router-link :to="{name: 'delete_product', params: { id: product.id }}" class="btn btn-danger">Delete</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
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
