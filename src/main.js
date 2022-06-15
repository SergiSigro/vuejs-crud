import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueResource from 'vue-resource';
Vue.use(VueResource);

import App from './App.vue';

import store from "./store";

const Welcome = require('./assets/js/components/welcome.vue');
const Cart = require('./assets/js/components/cart.vue');
const AllProducts = require('./assets/js/components/all-products.vue');

const routes = [
    {
        name: 'welcome',
        path: '/',
        component: Welcome,
        props: true
    },
    {
        name: 'all_products',
        path: '/products/:city',
        component: AllProducts,
        props: true
    },
    {
        name: 'cart',
        path: '/cart',
        component: Cart,
        props: true
    }
    
];
var router = new VueRouter({ routes: routes, mode: 'history' });


new Vue(Vue.util.extend({ router, store }, App)).$mount('#app');