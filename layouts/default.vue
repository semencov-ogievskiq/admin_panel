<template>
    <div>
      <b-navbar type="dark" variant="dark" tag="header" fixed="top">
          <b-navbar-brand @click="toggleSidebar">
            <b-icon-list variant="light"></b-icon-list>
          </b-navbar-brand>
          <b-navbar-brand to='/'>Панель Администратора</b-navbar-brand>
          
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown :text="user.mail" right>
              <b-dropdown-item-button @click="logout">Выход</b-dropdown-item-button>
            </b-nav-item-dropdown>
          </b-navbar-nav>
      </b-navbar>
      <sidebar :active="showSidebar" :toggle="toggleSidebar">

        <sidebar-item to="/users" text="Пользователи">
          <b-icon-people-fill></b-icon-people-fill>
          <template #list>
            <b-link to="/users" exact>Все пользователи</b-link>
            <b-link to="/users/addUser">Зарегистрировать</b-link>
            <b-link to="/groups">Группы</b-link>
            <b-link to="/sessions">Сессии</b-link>
          </template>
        </sidebar-item>

        
      </sidebar>
      <main>
          <b-container fluid>
            <nuxt />
          </b-container>
        </main>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import io from 'socket.io-client'

export default {
  data(){
    return {
      showSidebar: false
    }
  },
  async fetch(){
    this.updateGroups()
  },
  computed: {
    token(){
      return this.$auth.$storage._state['_token.local'].substr(7)
    },
    user(){
      return this.$store.$auth.$state.user
    }
  },
  methods: {
    ... mapActions('dict',['updateGroups']),
    logout: async function(){
      this.$auth.logout()
        .then(()=> this.$auth.redirect('login'))
        .catch((err)=> console.log(err))
    },
    toggleSidebar(){
      this.showSidebar = !this.showSidebar
    }
  },
  created(){
    // !!! По идеи объявление сокет соединения должны находиться не здесь
    this.$root.$socket = io(this.$root.context.env.backendUrl, {
      query:{ 
        token: this.token
      }
    })
    // При изменении данных group, перезапрашиваем данные
    this.$root.$socket.on('changedGroup', ()=>{
      this.updateGroups()
    })
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
        height: calc(100% - 3.5rem);
        padding-bottom: 2rem;
        transition: width .2s ease-in;
    }
    sidebar > .nav > .nav-item {
        margin-bottom: 1rem;
    }
    sidebar > .nav > .nav-item > .nav-link > span{
        display: none;
    }
    sidebar > .nav > .nav-item > .nav-link > .b-icon {
        display: inline-block;
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
    sidebar[class~="active"] > .nav > .nav-item > .nav-link > span{
        display: inline-block;
    }
    sidebar a:hover, sidebar a[class~="nuxt-link-active"],
    header > .navbar-brand > .b-icon:hover{
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