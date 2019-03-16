import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Home from './components/Home.vue';
import Landing from './components/Landing.vue';
import Signin from './components/Signin.vue';
import Signup from './components/Signup.vue';

Vue.use(VueRouter);

const routerOptions = [
    { path: '/', component: 'Landing'},
    { path: '/signin', component: 'Signin'},
    { path: '/signup', component: 'Signup'},
    { path: '/home', component: 'Home'},
    { path: '*', redirect: '/'}
]

new Vue ({
    el: '#app',
    router: routerOptions,
    render: app => app(App)
});
