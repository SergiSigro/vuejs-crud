<template>
  <div class="topnav">
    <img id="logo" src="../../img/logo.png">
    <router-link :to="{ name: 'welcome' }">Home</router-link>
    <a href="#cart">Cart</a>
    <div class="search-container">
      <form @submit.prevent="searchCity">
        <input type="text" placeholder="City.." name="search" v-model="cityName" id="city">
        <button type="submit"><i class="fa fa-search"></i></button>
      </form>
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