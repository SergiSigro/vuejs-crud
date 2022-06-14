<template>
  <div class="topnav" id="topnav">
    <img id="logo" src="../../img/logo.png">
    <router-link :to="{ name: 'welcome' }">Home</router-link>
    <router-link :to="{ name: 'cart' }">Cart <span class="glyphicon glyphicon-shopping-cart"></span></router-link>
    <div class="search-container" id="search-container">
      <div  id="autocomplete">
        <form @submit.prevent="searchCity" id="search-form" autocomplete="off">
        <input type="text" placeholder="City.." name="search" v-model="cityName" id="city">
        <button type="submit"><i class="fa fa-search"></i></button>
      </form>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        methods: {
          searchCity() {
            this.$router.push( { name: 'all_products', params: { city: this.cityName }} )
          },
        },
        data() {
            return {
              cityName: '',
            }
        },
    }
</script>