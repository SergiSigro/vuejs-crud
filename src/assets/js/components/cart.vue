<template>
    <div id="cart_products">
        <h1>Cart</h1>
        <p><router-link :to="{ name: 'welcome'}">Return to home page</router-link></p>
        <table class="table table-hover">
            <thead>
            <tr>
                <td class="product-id">ID</td>
                <td class="product-name">Name</td>
                <td class="product-qty">Quantity</td>
                <td class="product-price">Price</td>
                <td class="product-remove"></td>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in cartProducts" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>QTY:
                        <input v-model="product.qty" type="number" class="form-control"  min="1">
                    </td>
                    <td>${{ product.price | formatCurrency}}</td>
                    <td>
                        <button @click="removeItem(index)"><span class="glyphicon glyphicon-trash"></span></button>
                    </td>
                </tr>
                <tr v-show="cartProducts.length > 0">
                    <td></td>
                    <td class="text-right">Cart Total</td>
                    <td class="text-right">${{Total | formatCurrency}}</td>
                    <td></td>
                    <td></td>
                </tr>

            </tbody>
        </table>
        <div>
            <div id="paypal-button-container"></div>
            <div v-if="success" class="alert alert-success">
                <strong>Success!</strong> Payment successfuly done
            </div>
            <div v-if="error" class="alert alert-danger">
                <strong>Ooops!</strong>  Something went wrong!
            </div>
        </div>
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
                cartProducts: [],
                total: {},
                error: false,
                success: false
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
                this.total = total;
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
            removeItem(index){
                this.$store.state.cartProducts.splice(index, 1)
            },
            sendDataPaypal (creds) {
                return new Promise((resolve, reject) => {
                this.$http.post('http://localhost:3000/cart/checkout', creds).then(res => {
                    return resolve()
                }).catch((err) => {
                    return reject(err)
                })
                })
            }
            
        },
        mounted(){
           let  client = {
                  sandbox: 'YOUR CLIENT ID HERE',
           }
           let  payment = (data, actions) => {
                // Make a call to the REST api to create the payment
                return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: { total:this.total, currency: 'USD' }
                            }
                        ]
                    }
                });
            }
            let  onAuthorize = (data) => {
                var data = {
                    paymentID: data.paymentID,
                    payerID: data.payerID,
                    amount:this.total
                };
                this.sendDataPaypal({data:data}).then(() => {
                    this.success=true;
                    this.$store.state.cartProducts = [];
                }).catch(err=>{
                    this.error=true
                });
            }
            paypal.Button.render({
                env: 'sandbox', // sandbox | production
                commit: true,
                client,
                payment,
                onAuthorize
          }, '#paypal-button-container');
    }

    }
</script>