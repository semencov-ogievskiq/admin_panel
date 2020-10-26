<template>
  <b-row>
    <b-col cols="12">
        <h1>Редактировать: <small>{{user.f}} {{user.i}} {{user.o}}</small></h1>
    </b-col>
    <b-col cols="12" xl="6">
        <b-form @submit.prevent="editUser" @reset.prevent="editForm = {...user}">
            <b-form-group label="Email" label-for="Email" description="Email, указанный при регистрации">
                <b-form-input id="Email" v-model.trim="editForm.mail" type="email" readonly/>
            </b-form-group>
            <b-form-group label="Фамилия" label-for="F">
                <b-form-input id="F" v-model.trim="editForm.f" type="text"/>
            </b-form-group>
            <b-form-group label="Имя" label-for="I">
                <b-form-input id="I" v-model.trim="editForm.i" type="text"/>
            </b-form-group>
            <b-form-group label="Отчество" label-for="O">
                <b-form-input id="O" v-model.trim="editForm.o" type="text"/>
            </b-form-group>
            <b-form-group label="Дата рожденья" label-for="DB">
                <b-form-datepicker id="DB" v-model.trim="editForm.dt_birth" placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
            </b-form-group>

            <b-form-group label="Группы">
                <b-form-checkbox-group v-model="editForm.groups" stacked>
                    <b-form-checkbox v-for="group in groups" :key="group.id" :value="group.id">{{group.name}}</b-form-checkbox>
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
export default {
    async asyncData (context){
        if(!+context.params.id){
            context.redirect('/404')
        }else{
            let id = context.params.id
            let data = {
                user: null,
                groups: null,
                editForm: null
            }
            try{
                var res = await context.$axios.get(context.env.backendUrl + '/users/' + id)
                data.user = {...res.data.user}
                data.editForm = {...res.data.user}
                var res = await context.$axios.get(context.env.backendUrl + '/users/groups')
                data.groups = res.data.groups
                if(data.user){
                    return data
                }else{
                    context.redirect('/404')
                }
            }catch(err){
                context.redirect('/404')
            }
        }  
    },
    methods: {
        editUser(){

        }
    }
}
</script>