// store/index.js
 
import Vue from "vue";
import Vuex from "vuex";
 
Vue.use(Vuex);
 
export default new Vuex.Store({
 state: {
    cartProducts:[],
    cityName:'',
 },
 getters: {},
 mutations: {
    updateStoreCartProducts(state, payload){
        state.cartProducts = payload
        console.log(state.cartProducts)
    }
 },
 actions: {
   
 }
});