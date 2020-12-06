<template>
  <b-row>
    <b-col cols="12">
      <h1>Группа {{group.name}} (#{{group.id}})</h1>
    </b-col>
    <b-col cols="12" xl="10">
        <div>
            <strong>Название:</strong>
            <span class="ml-4">{{group.name}}</span>
        </div>
        <div>
            <strong>Описание:</strong>
            <span class="ml-4">{{group.description}}</span>
        </div>
    </b-col>
    <b-col cols="12" xl="2">
        <b-link class="btn btn-success" :to=" '/groups/' + group.id + '/edit'">Редактировать</b-link>
    </b-col>
  </b-row>
</template>

<script>
export default {
    data(){
        return {
            group: {
                id: null,
                name: null,
                description: null, 
            }
        }
    },
    async fetch (){
        if(!+this.$route.params.id){
            this.$router.replace({ path: '/404' })
        }else{
            let id = this.$route.params.id
            try{
                var res = await this.$axios.get(this.$root.context.env.backendUrl + '/users/groups/' + id)
                this.group = res.data.group
                if(!this.group){
                    this.$router.replace({ path: '/404' })
                }
            }catch(err){
                this.$router.replace({ path: '/404' })
            }
        }  
    },
    mounted(){
        this.$root.$socket.on('changedGroup', (id)=>{
            if( id == this.$route.params.id ){
                this.$fetch()
            }
        })
    }
}
</script>