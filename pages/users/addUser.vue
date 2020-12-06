<template>
  <b-row>
    <b-col cols="12">
        <h1>Регистрация нового пользователя</h1>
    </b-col>
    <b-col cols="12" xl="6">
        <!-- Progress Bar -->
        <div style="height: 2rem ">
            <b-progress v-if="loading" :value="loading" max="100" show-progress animated>
                <b-progress-bar :value="loading" :label=" loading + '%' "/>
            </b-progress>
        </div>
        <b-alert v-if="alert" show :variant=" (typeAlert)? typeAlert : null ">
            <h4>{{msgAlert.head}}</h4>
            <p>{{msgAlert.body}}</p>
        </b-alert>
        <!-- Форма редактирования данных пользователя -->
        <b-form @submit.prevent="addUser" @reset.prevent="resetForm">
            <b-form-group label="Email" label-for="Email">
                <b-form-input id="Email" v-model.trim="$v.addForm.mail.$model" :disabled="Boolean(loading)" type="email" :state=" ( $v.addForm.mail.$dirty )? !$v.addForm.mail.$invalid : null "/>
                <b-form-invalid-feedback id="F">
                    Поле должно содержать корректный email адрес
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Пароль" label-for="Password">
                <b-form-input id="Password" v-model.trim="$v.addForm.password.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.addForm.password.$dirty )? !$v.addForm.password.$invalid : null " />
                <b-form-invalid-feedback id="Password">
                    Пароль должен быть не менее 6 символов
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Повторите пароль" label-for="RepeatPassword">
                <b-form-input id="RepeatPassword" v-model.trim="$v.addForm.repeatPassword.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.addForm.repeatPassword.$dirty )? !$v.addForm.repeatPassword.$invalid : null " />
                <b-form-invalid-feedback id="RepeatPassword">
                    Пароли не совпадают
                </b-form-invalid-feedback>
            </b-form-group>


            <b-form-group label="Фамилия" label-for="F">
                <b-form-input id="F" v-model.trim="$v.addForm.f.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.addForm.f.$dirty )? !$v.addForm.f.$invalid : null " />
                <b-form-invalid-feedback id="F">
                    Поле должно содержать хотя бы два символа
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Имя" label-for="I">
                <b-form-input id="I" v-model.trim="$v.addForm.i.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.addForm.i.$dirty )? !$v.addForm.i.$invalid : null " />
                <b-form-invalid-feedback id="I">
                    Поле должно содержать хотя бы два символа
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Отчество" label-for="O">
                <b-form-input id="O" v-model.trim="$v.addForm.o.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.addForm.o.$dirty )? !$v.addForm.o.$invalid : null " />
                <b-form-invalid-feedback id="O">
                    <!-- Тут сообщение об ошибке -->
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Дата рожденья"  label-for="DB">
                <b-form-datepicker id="DB" v-model.trim="$v.addForm.dt_birth.$model" :disabled="Boolean(loading)" :state=" ( $v.addForm.dt_birth.$dirty )? !$v.addForm.dt_birth.$invalid : null " placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
                <b-form-invalid-feedback id="DB">
                    Поле обязательно для заполнения
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Группы">
                <b-form-checkbox-group v-model="$v.addForm.groups.$model" stacked :disabled="Boolean(loading)">
                    <b-form-checkbox v-for="group in groups" :key="group.id" :value="group.id" >{{group.name}}</b-form-checkbox>
                </b-form-checkbox-group>
            </b-form-group>
            
            <div>
                <b-button class="float-left mx-2" @click="$router.go(-1)" type="button" variant="secondary">Назад</b-button>
                <b-button class="float-right mx-2" type="submit" variant="primary">Редактировать</b-button>
                <b-button class="float-right mx-2" type="reset" variant="secondary">Сбросить</b-button>
            </div>
        </b-form>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

export default {
    data(){
        return {
            groups: null,
            addForm: {
                mail: null,
                password: null,
                repeatPassword: null,
                f: null,
                i: null,
                o: null,
                dt_birth: null,
                groups: []
            },
            loading: null,
            typeAlert: null,
            alert: false,
            msgAlert: { head: null, body: null }
        }
    },
    validations: {
        addForm: {
            mail: { required, email },
            password: { required, minLength: minLength(6) },
            repeatPassword: { required, sameAs: sameAs('password') },
            f: { required, minLength: minLength(2) },
            i: { required, minLength: minLength(2) },
            o: {  },
            dt_birth: { required },
            groups: {  }
        }
    },
    async fetch(){
        try{
            var res = await this.$axios.get(this.$root.context.env.backendUrl + '/users/groups')
            this.groups = res.data.groups
            this.$v.$reset()
        }catch(err){
            console.log(err)
        }
    },
    methods:{
        showAlert( _type, _head, _body ){
            this.typeAlert = _type,
            this.alert = true,
            this.msgAlert = { head: _head, body: _body }
        },
        hideAlert(){
            this.typeAlert = null,
            this.alert = false,
            this.msgAlert = { head: null, body: null }
        },
        resetForm(){
            this.addForm = {
                mail: null,
                password: null,
                repeatPassword: null,
                f: null,
                i: null,
                o: null,
                dt_birth: null,
                groups: []
            }
            this.$v.$reset()
        },
        async addUser(){
            this.hideAlert()
            if ( 
                !this.$v.addForm.mail.$dirty || !this.$v.addForm.password.$dirty || 
                !this.$v.addForm.repeatPassword.$dirty || !this.$v.addForm.f.$dirty ||
                !this.$v.addForm.i.$dirty || !this.$v.addForm.dt_birth.$dirty
            ){
                this.showAlert( 'danger', 'Внимание', 'Заполните все обязательные поля' )
            // }else if( this.$v.$invalid ){
            //     this.showAlert( 'danger', 'Внимание', 'Проверте правельность заполнения формы' )
            }else{
                // Адрес запроса
                let url = this.$root.context.env.backendUrl + '/users/addUser'
                // Данные формы
                let formData = { ...this.addForm, dt_birth: moment( this.addForm.dt_birth ).format( 'DD.MM.YYYY' ) }
                let options = { 
                    onUploadProgress: function( e ){ this.loading = parseInt( Math.round( ( e.loaded / e.total ) * 100) ) }.bind( this ),
                    validateStatus: function( status ){ return status >= 200 && status < 500 }  
                }
                try{
                    let res = await this.$axios.post( url, formData, options )
                    if( res.status >= 400 ) throw new Error( res.status + ' - ' + res.statusText )
                    if( !res.data.id ) throw new Error( 'Не пришел идентификатор пользователя' )
                    this.loading = null
                    this.showAlert( 'success', 'Внимание', 'Пользоатель зарегистрирован' )
                    this.resetForm()
                }catch( err ){
                    this.loading = null
                    this.showAlert( 'danger', 'Внимание', 'В результате регистрации пользователя произошла ошибка. Проверте введенные данные в форму и повторите попытку' )
                    console.log( err )
                }
            }
        }
    },
    mounted(){
        this.$root.$socket.on('changedGroup', ()=>{
            this.$fetch()
        })
    }
}
</script>