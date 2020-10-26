<template>
    <div>
        <!-- ---------------------------- ШАПКА ---------------------------- -->
        <b-navbar type="dark" variant="dark" tag="header" fixed="top">
            <b-navbar-brand @click="showSidebar = !showSidebar">
              <b-icon-list variant="light"></b-icon-list>
            </b-navbar-brand>
            <b-navbar-brand to='/'>Панель Администратора</b-navbar-brand>
        </b-navbar>
        <sidebar class="bg-dark" :class="(showSidebar)?'active':''">
          <b-nav class="flex-column">
            <b-nav-item to="/users">
              <b-icon-people-fill></b-icon-people-fill>
							<span>Пользователи</span>
            </b-nav-item>
            <b-nav-item to="/test">
              <b-icon-earbuds></b-icon-earbuds>
							<span>test</span>
            </b-nav-item>
          </b-nav>
        </sidebar>
        <main>
          <b-container fluid>
            <nuxt />
          </b-container>
        </main>
    </div>
</template>

<script>
export default {
  data: ()=>{
    return {
      socket: null,
      showSidebar: false
    }
  },
  computed: {
    token: function(){
      return this.$auth.$storage._state['_token.local'].substr(7)
    }
  },
  methods: {
    logout: async function(){
      this.$auth.logout()
        .then(()=> this.$auth.redirect('login'))
        .catch((err)=> console.log(err))
    },
    /**
     * Подключение сокет соединение с обработчиком ошибок
     */
    setSocket: function(){
      this.socket = this.$nuxtSocket({
        name:"main",
        persist: true, 
        query:{ 
          token: this.token
        }
      })
      this.socket.on('error',(err)=>{
        if(typeof err === 'string' && err === 'Unauthorized'){
          this.logout()
        }else{
          console.log(err)
        }
      })
    }
  },
  created: function(){
    this.setSocket()
  }
}
</script>

<style>
    html, body, #__nuxt, #__layout, 
    #__layout > div,  #__layout > div > main {
        height: 100%;
    }

    header > .navbar-brand {
        cursor:pointer;
    }
    sidebar {
        position: fixed;
        top: 3.5rem;
        width: 3rem;
        z-index: 1;
        height: calc(100% - 4.1rem);
        padding-bottom: 2rem;
        transition: width .2s ease-in;
        /*overflow-y: auto;*/
    }
    sidebar > .nav > .nav-item {
        /*margin-top: 1rem;*/
        margin-bottom: 1rem;
    }
    sidebar > .nav > .nav-item > .nav-link > span,
    sidebar > .nav > .nav-item > ul {
        display: none;
        opacity: 0;
        transition: opacity 3s step-start;
    }
    sidebar > .nav > .nav-item > ul {
        margin-top: 2rem;
        list-style: none;
    }
    sidebar > .nav > .nav-item > ul > li {
        margin: 0.5rem;
    }
    sidebar > .nav > .nav-item:last-child {
        padding-bottom: 2.2rem;
    }

    sidebar > .nav > .nav-item > .nav-link > .b-icon {
        opacity: unset;
        display: inline-block;
        top: unset;
        left: 1rem;
    }
    sidebar > .nav > .nav-item > .nav-link > span {
        position: absolute;
        left: 3rem;
    }
    sidebar a {
        color: #f8f9fa !important;
        text-decoration: none;
    }
    sidebar:hover, sidebar[class~="active"] {
        width: 15rem;
    }
    sidebar:hover > .nav > .nav-item > .nav-link > span,
    sidebar[class~="active"] > .nav > .nav-item > .nav-link > span,
    sidebar > .nav > .nav-item:hover > ul,
    sidebar:hover > .nav > .nav-item > .nav-link[class~='active'] + ul,
    sidebar[class~="active"] > .nav > .nav-item > .nav-link[class~='active'] + ul {
        display: inline-block;
        opacity: unset;
    }
    sidebar a:hover, sidebar a[class~="active"], header > .navbar-brand > .b-icon:hover,
    sidebar a:hover, sidebar a[class~="active"] > nav > .nav-item > .nav-link,
    sidebar .nuxt-link-active {
        color: #007bff !important;
        text-decoration: none;
    }
    main {
        margin-top: 4.1rem;
        margin-left: 4rem;
        padding-top: 0.1rem;
    }
    @media (min-width: 768px) {
        sidebar[class~="active"] + main {
            margin-left: 16rem;
        }
    }
</style>