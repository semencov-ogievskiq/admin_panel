<template>
    <b-row>
        <!-- User Data -->
        <b-col cols="12" lg="4" xl="3">
            <b-list-group>
                <b-list-group-item class="bg-light py-2 text-center">
                    <b-img src="" blank thumbnail alt="?" rounded="circle" style="height: 10rem; width: 10rem;"/>
                </b-list-group-item>
                <b-list-group-item>
                    <!-- Информация на пользователя -->
                    <h5 class="text-center">{{user.f}} {{user.i}} {{user.o}}</h5>
                    <h5 class="text-center" :class="(status)?'text-success':'text-danger'"><b-icon-circle-fill class="mr-2" font-scale="0.7"/>{{(status)?'online':'offline'}}</h5>
                    <ul class="p-0" style="list-style: none;">
                        <li><strong class="mr-3">Mail:</strong> {{user.mail}}</li>
                        <li><strong class="mr-3">Дата рождения:</strong> {{user.dt_birth}}</li>
                        <li>
                            <b-link v-b-toggle.groupCollapseUser class="text-secondary font-weight-bold" style="text-decoration: none;">Состоит в группах <b-icon-caret-down-fill/></b-link> 
                            <b-collapse class="my-2 pl-4" id="groupCollapseUser" >
                                <template v-for="group in user.groups" >
                                    <div :key="group" >{{group}} - {{ showGroupName(group) }}</div>
                                </template>
                            </b-collapse>
                        </li>
                    </ul>
                </b-list-group-item>
                <b-list-group-item variant="success" class="text-center" :to=" '/users/' + user.id + '/edit'">
                    Редактировать
                </b-list-group-item>
            </b-list-group>
        </b-col>
        <!-- Body -->
        <b-col cols="12" lg="8" xl="9">
           
        </b-col>
    </b-row>
</template>

<script>
export default {
    data(){
        return {
            user: {
                f: null,
                i: null,
                o: null,
                mail: null,
                dt_birth: null,
                groups: []   
            },
            status: false,
            groups: []
        }
    },
    async fetch (){
        if(!+this.$route.params.id){
            this.$router.replace({ path: '/404' })
        }else{
            let id = this.$route.params.id
            try{
                var res = await this.$axios.get(this.$root.context.env.backendUrl + '/users/' + id)
                this.user = res.data.user
                var res = await this.$axios.get(this.$root.context.env.backendUrl + '/users/groups')
                this.groups = res.data.groups
                this.getStatusUser()
                if(!this.user){
                    this.$router.replace({ path: '/404' })
                }
            }catch(err){
                this.$router.replace({ path: '/404' })
            }
        }  
    },
    methods:{
        showGroupName(_id){
            let data = this.groups.find( (e)=>{ return e.id == _id } )
            return ( data )? data.name: null
        },
        /**
         * Метод запроса статуса подключения пользователя по socket.io
         */
        getStatusUser(){
            this.$root.$socket.emit('client_status', this.$route.params.id, (status)=>{
                this.status = status
            })
        }
    },
    mounted(){
        // При изменение состояния подключения пользователя, перезапрашиваем его состояие
        this.$root.$socket.on('changedStateUser', (id)=>{
            console.log('123')
            if( id == this.$route.params.id ){
                this.getStatusUser()
            }
        })
        // При изменение данных пользователя, перезапрашиваем данные страницы
        this.$root.$socket.on('changedUser', (id)=>{
            if( id == this.$route.params.id ){
                this.$fetch()
            }
        })
        // При изменение данных групп, перезапрашиваем данные страницы
        this.$root.$socket.on('changedGroup', ()=>{
            this.$fetch()
        })
    }
}
</script>