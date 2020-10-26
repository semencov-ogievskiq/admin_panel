export default {
  mode: 'spa',
  //rootDir: '',
  server: {
    port: 80,
    host: '0.0.0.0',// '192.168.1.64'
  },
  env: {
    /**
     * При сборке указать локальный адрес сервера.
     * Для ajax запросов
     */
    backendUrl: 'http://localhost:81'
  },
  router: {
    base: '/admin/',
    middleware: ['auth', 'main']
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'admin-panel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'nuxt-socket-io',
  ],
  io: {
    sockets: [{name:'main',url:'http://localhost:81',default:true, persist: true}]
  },
  auth:{
    strategies: {
      local: {
        endpoints: {
          login: { url: 'http://localhost:81/login', method: 'post', propertyName: 'token'},//'http://192.168.1.64:81/login'
          logout: false,
          user: { url: 'http://localhost:81/client', method: 'get', propertyName: 'user'}
        }
      }
    }
  },
  bootstrapVue: {
    icons: true
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
