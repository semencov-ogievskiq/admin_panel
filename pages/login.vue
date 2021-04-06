<template>
  <b-row>
    <b-col class="mx-auto" cols="12" md="8" lg="5">
      <b-card class="shadow-lg bg-white border-0 ">

        <h3 class="mb-4 font-weight-bold">Панель администратора</h3>

        <b-nav class="mb-4" tabs justified>
          <b-nav-item :active="!signUp" @click="toggleSignUp(false)" >Авторизация</b-nav-item>
          <b-nav-item :active="signUp" @click="toggleSignUp(true)" >Регистрация</b-nav-item>
        </b-nav>

        <!-- Авторизация -->
        <template v-if="!signUp">
          <b-alert v-if="loginFormControl.alert" show variant="danger">
              Пользователь не найден
          </b-alert>

          <b-form @submit.prevent="onSignIn">
            <b-form-group label="Email" label-for="EmailLogin">
              <b-form-input id="EmailLogin" required v-model.trim="$v.loginForm.username.$model" :disabled="Boolean(loginFormControl.loading)" type="email" :state=" ( $v.loginForm.username.$dirty )? !$v.loginForm.username.$invalid : null " />
              <b-form-invalid-feedback>
                Введите корректный email адрес
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Пароль" label-for="PasswordLogin">
              <b-form-input id="PasswordLogin" required v-model.trim="$v.loginForm.password.$model" :disabled="Boolean(loginFormControl.loading)" type="password" :state=" ( $v.loginForm.password.$dirty )? !$v.loginForm.password.$invalid : null "  />
              <b-form-invalid-feedback>
                Обязательно для заполнения
              </b-form-invalid-feedback>
            </b-form-group>
            <div class='mt-4 text-center'>
              <b-button style='width: 150px' variant='primary' type="submit">Вход</b-button>
            </div>
          </b-form>
        </template>

        <!-- Регистрация -->
        <template v-else>
          <!-- Progress Bar -->
          <div style="height: 2rem ">
              <b-progress v-if="regFormControl.loading" :value="regFormControl.loading" max="100" show-progress animated>
                  <b-progress-bar :value="regFormControl.loading" :label=" regFormControl.loading + '%' "/>
              </b-progress>
          </div>
          <b-alert v-if="regFormControl.alert" show :variant=" (regFormControl.typeAlert)? regFormControl.typeAlert : null ">
              <h4>{{regFormControl.msgAlert.head}}</h4>
              <p>{{regFormControl.msgAlert.body}}</p>
          </b-alert>

          <b-form @submit.prevent="onSignUp" @reset.prevent="resetRegForm">
            <b-form-group label="Email" label-for="Email">
                <b-form-input id="Email" v-model.trim="$v.regForm.mail.$model" :disabled="Boolean(regFormControl.loading)" type="email" :state=" ( $v.regForm.mail.$dirty )? !$v.regForm.mail.$invalid : null "/>
                <b-form-invalid-feedback id="F">
                    Поле должно содержать корректный email адрес
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Пароль" label-for="Password">
                <b-form-input id="Password" v-model.trim="$v.regForm.password.$model" :disabled="Boolean(regFormControl.loading)" type="password" :state=" ( $v.regForm.password.$dirty )? !$v.regForm.password.$invalid : null " />
                <b-form-invalid-feedback id="Password">
                    Пароль должен быть не менее 6 символов
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Повторите пароль" label-for="RepeatPassword">
                <b-form-input id="RepeatPassword" v-model.trim="$v.regForm.repeatPassword.$model" :disabled="Boolean(regFormControl.loading)" type="password" :state=" ( $v.regForm.repeatPassword.$dirty )? !$v.regForm.repeatPassword.$invalid : null " />
                <b-form-invalid-feedback id="RepeatPassword">
                    Пароли не совпадают
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Фамилия" label-for="F">
                <b-form-input id="F" v-model.trim="$v.regForm.f.$model" :disabled="Boolean(regFormControl.loading)" type="text" :state=" ( $v.regForm.f.$dirty )? !$v.regForm.f.$invalid : null " />
                <b-form-invalid-feedback id="F">
                    Поле должно содержать хотя бы два символа
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Имя" label-for="I">
                <b-form-input id="I" v-model.trim="$v.regForm.i.$model" :disabled="Boolean(regFormControl.loading)" type="text" :state=" ( $v.regForm.i.$dirty )? !$v.regForm.i.$invalid : null " />
                <b-form-invalid-feedback id="I">
                    Поле должно содержать хотя бы два символа
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Дата рожденья"  label-for="DB">
                <b-form-datepicker id="DB" v-model.trim="$v.regForm.dt_birth.$model" :disabled="Boolean(regFormControl.loading)" :state=" ( $v.regForm.dt_birth.$dirty )? !$v.regForm.dt_birth.$invalid : null " placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
                <b-form-invalid-feedback id="DB">
                    Поле обязательно для заполнения
                </b-form-invalid-feedback>
            </b-form-group>
            
            <div>
              <b-button class="mx-2" type="reset" variant="secondary">Сбросить</b-button>
              <b-button class="mx-2" type="submit" variant="primary">Отправить</b-button>
            </div>
          </b-form>
        </template>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

export default {
  auth: false,
  layout: 'unauthorized',
  data: function(){
    return {
      signUp: false,
      loginFormControl: {
        loading: false,
        typeAlert: null,
        alert: false,
        msgAlert: { head: null, body: null }
      },
      loginForm: {
        username: '',
        password: ''
      },
      regFormControl: {
        loading: null,
        typeAlert: null,
        alert: false,
        msgAlert: { head: null, body: null }
      },
      regForm: {
        mail: null,
        password: null,
        repeatPassword: null,
        f: null,
        i: null,
        dt_birth: null
      }
    }
  },
  validations: {
    loginForm: {
      username: { required, email },
      password: { required }
    },
    regForm: {
      mail: { required, email },
      password: { required, minLength: minLength(6) },
      repeatPassword: { required, sameAs: sameAs('password') },
      f: { required, minLength: minLength(2) },
      i: { required, minLength: minLength(2) },
      dt_birth: { required }
    }
  },
  methods: {
    toggleSignUp(state){
      if( this.signUp != state ) this.signUp = !this.signUp
    },
    onSignIn(){ // Метод авторизации пользователя
      this.loginFormControl.loading = true
      this.$auth.loginWith('local', { data: this.loginForm })
        .then(()=> this.$auth.redirect('home') )
        .catch((err)=> {
          console.log(err)
          this.loginFormControl.alert = true
          this.loginFormControl.loading = false
        })
    },
    showAlertRegForm( _type, _head, _body ){
      this.regFormControl.typeAlert = _type,
      this.regFormControl.alert = true,
      this.regFormControl.msgAlert = { head: _head, body: _body }
    },
    hideAlertRegForm(){
      this.regFormControl.typeAlert = null,
      this.regFormControl.alert = false,
      this.regFormControl.msgAlert = { head: null, body: null }
    },
    resetRegForm(){
      this.regForm = {
        mail: null,
        password: null,
        repeatPassword: null,
        f: null,
        i: null,
        dt_birth: null,
      }
      this.$v.regForm.$reset()
    },
    async onSignUp(){
      this.hideAlertRegForm()
      if ( 
        !this.$v.regForm.mail.$dirty || !this.$v.regForm.password.$dirty || 
        !this.$v.regForm.repeatPassword.$dirty || !this.$v.regForm.f.$dirty ||
        !this.$v.regForm.i.$dirty || !this.$v.regForm.dt_birth.$dirty
      ){
        this.showAlertRegForm( 'danger', 'Внимание', 'Заполните все обязательные поля' )
      }else{
        // Адрес запроса
        let url = this.$root.context.env.backendUrl + '/registration'
        // Данные формы
        let formData = { ...this.regForm, dt_birth: moment( this.regForm.dt_birth ).format( 'DD.MM.YYYY' ) }
        let options = { 
          onUploadProgress: function( e ){ this.regFormControl.loading = parseInt( Math.round( ( e.loaded / e.total ) * 100) ) }.bind( this ),
          validateStatus: function( status ){ return status >= 200 && status < 500 }  
        }
        try{
          let res = await this.$axios.post( url, formData, options )
          if( res.status >= 400 ) throw new Error( res.status + ' - ' + res.statusText )
          if( !res.data.id ) throw new Error( 'Не пришел идентификатор пользователя' )
          this.regFormControl.loading = null
          this.showAlertRegForm( 'success', 'Внимание', 'Пользоатель зарегистрирован' )
          this.resetRegForm()
        }catch( err ){
          this.regFormControl.loading = null
          this.showAlertRegForm( 'danger', 'Внимание', 'В результате регистрации пользователя произошла ошибка. Проверте введенные данные в форму и повторите попытку' )
          console.log( err )
        }
      }
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

<style>
  .card {
    text-align: center;
  }

  .card > .card-header, .card > .card-footer {
    background-color: inherit;
    border: 0;
  }
  .card-header {
    padding-left: 0;
    padding-right: 0;
  }

</style>