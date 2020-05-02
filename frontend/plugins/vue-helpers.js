import Vue from 'vue';

Vue.prototype.$clone = (value) => JSON.parse(JSON.stringify(value));
