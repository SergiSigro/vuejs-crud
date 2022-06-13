<template>
    <div id="cart_products">
        <h1>Cart</h1>
        <p><router-link :to="{ name: 'welcome'}">Return to home page</router-link></p>
        <table class="table table-hover">
            <thead>
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Quantity</td>
                <td>Price</td>
            </tr>
            </thead>
            <tbody>
                <tr v-for="product in cartProducts" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td style="width:120px">QTY:
                        <input v-model="product.qty" type="number" class="form-control"  min="1">
                    </td>
                    <td>{{ product.price }}</td>
                </tr>
                <tr v-show="cartProducts.length > 0">
                    <td></td>
                    <td class="text-right">Cart Total</td>
                    <td class="text-right">${{Total | formatCurrency}}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    function formatNumber(n, c, d, t){
        var c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d === undefined ? '.' : d, 
        t = t === undefined ? ',' : t, 
        s = n < 0 ? '-' : '', 
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
        j = (j = i.length) > 3 ? j % 3 : 0;
	    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    }
    export default{
        data(){
            return{
                cartProducts: []
                
            }
        },
        
        created: function(){
            this.getData();
        },
        updated: function(){
            this.getData();
        },
        computed: {
            Total(){
                let total  = 0;
                this.cartProducts.forEach(product => {
                    total += product.qty*product.price;
                });
                return total;
            }
        },
        filters: {
            formatCurrency: function(value){
                return formatNumber(value, 2, '.', ',')
            }
        },

        methods: {
            getData: function(){
                
                this.cartProducts = this.$store.state.cartProducts;
                
            },
            
        }

    }
</script>