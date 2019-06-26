import Vue from 'vue';
import VueHighlightJS from 'vue-highlight.js';

// Languages
import javascript from 'highlight.js/lib/languages/javascript';

// Use plugin
Vue.use(VueHighlightJS, { languages: { javascript } });
