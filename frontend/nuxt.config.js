import pkg from './package'
import {
  Login  as LoginEndpoint,
  Logout as LogoutEndpoint,
  User   as UserEndpoint
} from './constants/endpoints'


export default {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'highlight.js/styles/default.css',
    '@/assets/scss/main.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    'plugins/v-tooltip',
    'plugins/vue-localstorage',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',

    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },

  /**
  ** Proxy API requests
  */
  proxy: {
    '/api': { target: 'http://localhost:8000' }
  },

  /*
  ** Auth module configuration
  */
  auth: {
    strategies: {
      tokenType: 'bearer',

      local: {
        endpoints: {
          user: { url: UserEndpoint, method: 'get', propertyName: false },
          login: { url: LoginEndpoint, method: 'post', propertyName: 'access_token' },
          logout: { url: LogoutEndpoint, method: 'get', propertyName: false }
        },
      }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  }
}
