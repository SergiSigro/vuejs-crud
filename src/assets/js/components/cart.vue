<template>
    <div class="container">
        <h1><b>Welcome!</b></h1>
        <button @click="help()"></button>
    </div>
</template>
<script>
    export default {
        methods:{
            help: function(){
                console.log(this.$store.state.cartProducts)
            }
        }
    }
</script>