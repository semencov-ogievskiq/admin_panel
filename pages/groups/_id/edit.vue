<template>
  <b-row>
    <b-col cols="12">
        <h1>Редактировать группу: <small>{{group.name}} (#{{group.id}})</small></h1>
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
        <b-form @submit.prevent="editGroup" @reset.prevent="editForm = {...group}">
            <b-form-group label="Название" label-for="name">
                <b-form-input id="name" v-model.trim="$v.editForm.name.$model" :disabled="Boolean(loading)" type="text" :state=" ( $v.editForm.name.$dirty )? !$v.editForm.name.$invalid : null " />
                <b-form-invalid-feedback id="name">
                    Поле должно содержать хотя бы два символа
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Фамилия" label-for="description">
                <b-form-textarea id="description" v-model.trim="$v.editForm.description.$model" :disabled="Boolean(loading)" :state=" ( $v.editForm.description.$dirty )? !$v.editForm.description.$invalid : null "></b-form-textarea>
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
import { required, minLength } from 'vuelidate/lib/validators'

export default {
    data(){
        return {
            group: {
                id: null,
                name: null,
                description: null
            },
            editForm: {
                id: null,
                name: null,
                description: null
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
                var res = await this.$axios.get(this.$root.context.env.backendUrl + '/users/groups/' + id)
                this.group = {...res.data.group}
                this.editForm = {...res.data.group}

                this.$v.$reset()
                if(!this.group){
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
            name: { required, minLength: minLength(2) },
            description: { }
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
        async editGroup(){
            this.hideAlert()
            if ( !this.$v.$anyDirty ){
                this.showAlert( 'warning', 'Внимание', 'Для отправки формы измените хотя бы одно значение' )
            }else if( this.$v.$invalid ){
                this.showAlert( 'danger', 'Внимание', 'Проверте правельность заполнения формы' )
            }else{
                // Адрес запроса
                let url = this.$root.context.env.backendUrl + '/users/groups/' + this.editForm.id
                // Данные формы
                let formData = { ...this.editForm }
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
    }
}
</script>