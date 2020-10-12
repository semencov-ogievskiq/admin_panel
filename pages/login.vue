<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">
          Авторизация в системе
        </h1>
      </div>
      <div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <b-alert :show="err" variant="danger">
          <h4>Ошибка авторизации</h4>
          <p>Попробуйте повторить попытку или отправте описание ошибки администрации сайта.</p>
          <p>{{errMsg}}</p>
        </b-alert>
        <b-form @submit.prevent="onSubmit">
          <b-form-group id='username-group' label='Email' label-for='username' description='Введите ваш email адрес, который вы указывали при регистрации.'>
            <b-form-input id='username' v-model.trim='loginForm.username' type='email' required placeholder='Email'></b-form-input>
          </b-form-group>
          <b-form-group id='password-group' label='Пароль' label-for='password'>
            <b-form-input id='password' v-model.trim='loginForm.password' type='password' required placeholder='Пароль'></b-form-input>
          </b-form-group>
          <div class='mt-4 text-center'>
            <b-button style='width: 150px' variant='primary' type="submit">Вход</b-button>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  layout: 'unauthorized',
  data: function(){
    return {
      loginForm: {
        username: '',
        password: ''
      },
      err: false,
      errMsg: ''
    }
  },
  methods: {
    onSubmit(){ // Метод авторизации пользователя
      this.$auth.loginWith('local', { data: this.loginForm })
        .then(()=> this.$auth.redirect('home') )
        .catch((err)=> {
          console.log(err)
          this.err = true
          this.errMsg = err
        })
    }
  },
  mounted: function(){
    // Если пользователь авторизован то перенаправляем на главную
    if(this.$auth.loggedIn){
      this.$router.replace({ path: '/' })
    }
  }
}
</script>