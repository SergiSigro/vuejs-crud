<template>
    <div class="container">
        <search-city></search-city>
        <div id="page">
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<style>
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
</style>

<script>
    import Search from './assets/js/components/search.vue';

    export default {
        data(){
            return{
                cartProducts: []
            };
        },

        components: {
            'searchCity' : Search
        },

        methods: {
            
        }
    }
</script>
