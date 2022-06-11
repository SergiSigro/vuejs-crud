<template>
  <div class="container">
    <form @submit.prevent="searchCity">
        <div class="form-group">
            <label name="city">City</label>
            <input type="text" class="form-control" v-model="cityName" id="city">
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Search</button>
        </div>
    </form>
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