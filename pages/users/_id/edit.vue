<template>
  <b-row>
    <b-col cols="12">
        <h1>Редактировать: <small>{{user.f}} {{user.i}} {{user.o}}</small></h1>
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
        <b-form @submit.prevent="editUser" @reset.prevent="editForm = {...user}">
            <b-form-group label="Email" label-for="Email" description="Email, указанный при регистрации">
                <b-form-input id="Email" v-model.trim="editForm.mail" :disabled="Boolean(loading)" type="email" readonly/>
            </b-form-group>
            <b-form-group label="Фамилия" label-for="F">
                <b-form-input id="F" v-model.trim="$v.editForm.f.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.editForm.f.$dirty )? !$v.editForm.f.$invalid : null " />
                <b-form-invalid-feedback id="F">
                    Поле должно содержать хотя бы два символа
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Имя" label-for="I">
                <b-form-input id="I" v-model.trim="$v.editForm.i.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.editForm.i.$dirty )? !$v.editForm.i.$invalid : null " />
                <b-form-invalid-feedback id="I">
                    Поле должно содержать хотя бы два символа
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Отчество" label-for="O">
                <b-form-input id="O" v-model.trim="$v.editForm.o.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.editForm.o.$dirty )? !$v.editForm.o.$invalid : null " />
                <b-form-invalid-feedback id="O">
                    <!-- Тут сообщение об ошибке -->
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Дата рожденья"  label-for="DB">
                <b-form-datepicker id="DB" v-model.trim="$v.editForm.dt_birth.$model" :disabled="Boolean(loading)" :state=" ( $v.editForm.dt_birth.$dirty )? !$v.editForm.dt_birth.$invalid : null " placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
                <b-form-invalid-feedback id="DB">
                    Поле обязательно для заполнения
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Группы">
                <b-form-checkbox-group v-model="$v.editForm.groups.$model" stacked :disabled="Boolean(loading)">
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
import { required, minLength } from 'vuelidate/lib/validators'

export default {
    data(){
        return {
            user: {
                mail: null,
                f: null,
                i: null,
                o: null,
                dt_birth: null,
                groups: []
            },
            groups: null,
            editForm: {
                mail: null,
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
    async fetch(){
        if(!+this.$route.params.id){
            this.$router.replace({ path: '/404' })
        }else{
            let id = this.$route.params.id
            try{
                var res = await this.$axios.get(this.$root.context.env.backendUrl + '/users/' + id)
                this.user = {...res.data.user}
                this.editForm = {...res.data.user}
                this.editForm.dt_birth = moment(this.editForm.dt_birth, 'DD.MM.YYYY').toDate()

                var res = await this.$axios.get(this.$root.context.env.backendUrl + '/users/groups')
                this.groups = res.data.groups
                this.$v.$reset()
                if(!this.user){
                    this.$router.replace({ path: '/404' })
                }
            }catch(err){
                console.log(err)
                this.$router.replace({ path: '/404' })
            }
        }
    },
    validations: {
        editForm: {
            f: { required, minLength: minLength(2) },
            i: { required, minLength: minLength(2) },
            o: {  },
            dt_birth: { required },
            groups: {  }
        }
    },
    methods: {
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
        async editUser(){
            this.hideAlert()
            if ( !this.$v.$anyDirty ){
                this.showAlert( 'warning', 'Внимание', 'Для отправки формы измените хотя бы одно значение' )
            }else if( this.$v.$invalid ){
                this.showAlert( 'danger', 'Внимание', 'Проверте правельность заполнения формы' )
            }else{
                // Адрес запроса
                let url = this.$root.context.env.backendUrl + '/users/' + this.editForm.id
                // Данные формы
                let formData = { ...this.editForm, dt_birth: moment( this.editForm.dt_birth ).format( 'DD.MM.YYYY' ) }
                let options = { 
                    onUploadProgress: function( e ){ this.loading = parseInt( Math.round( ( e.loaded / e.total ) * 100) ) }.bind( this ),
                    validateStatus: function( status ){ return status >= 200 && status < 500 }  
                }
                try{
                    let res = await this.$axios.put( url, formData, options )
                    if( res.status >= 400 ) throw new Error( res.status + ' - ' + res.statusText )
                    this.loading = null
                    this.showAlert( 'success', 'Внимание', 'Данные успешно изменены' )
                    this.$fetch()
                    this.$v.$reset()
                }catch( err ){
                    this.loading = null
                    this.showAlert( 'danger', 'Внимание', 'В результате редактирования произошла ошибка. Проверте введенные данные в форму и повторите попытку' )
                    console.log( err )
                }
            }
        }
    },
    mounted(){
        this.$root.$socket.on('changedUser', (id)=>{
            if( id == this.$route.params.id ){
                this.$fetch()
                this.hideAlert()
            }
        })
        this.$root.$socket.on('changedGroup', ()=>{
            this.$fetch()
        })
    }
}
</script>