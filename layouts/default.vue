<template>
    <div>
        <!-- ---------------------------- ШАПКА ---------------------------- -->
        <b-navbar type="dark" variant="dark" tag="header">
            <b-navbar-brand to='/login'>Панель Администратора</b-navbar-brand>
        </b-navbar>
        <div class="my-4 mx-2 position-relative" style="top: -6.5rem; padding-top: 6.5rem;">
          <b-container fluid>
            <b-row>
              <!-- ------------------------ БОКОВАЯ ПАНЕЛЬ ------------------------ -->
              <b-col md="2" tag="nav">
                  <b-nav vertical>
                    <b-nav-item to="/users">Пользователи</b-nav-item>
                    <b-nav-item to="/test">test</b-nav-item>
                    <b-nav-item @click="logout">Выход</b-nav-item>
                  </b-nav>
              </b-col>
              <!-- ----------------------------- ТЕЛО ----------------------------- -->
              <b-col md="10" tag="main">
                <nuxt />
              </b-col>
            </b-row>
          </b-container>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    logout: async function(){
      this.$auth.logout()
        .then(()=> this.$auth.redirect('login'))
        .catch((err)=> console.log(err))
    }
  }
}
</script>

<style>
    html, body, #__nuxt, #__layout, 
    #__layout > div,  #__layout > div > main {
        height: 100%;
    }
</style>