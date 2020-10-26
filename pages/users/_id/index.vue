<template>
  <b-row>
    <b-col cols="12">
      <h1>{{user.f}} {{user.i}} {{user.o}}</h1>
    </b-col>
    <b-col cols="12" xl="10">
        <div>
            <strong>E-mail:</strong>
            <span class="ml-4">{{user.mail}}</span>
        </div>
        <div>
            <strong>ФИО:</strong>
            <span class="ml-4">{{user.f}} {{user.i}} {{user.o}}</span>
        </div>
        <div>
            <strong>Группы:</strong>
            <ul>
                <li v-for="group in user.groups" :key="group">
                    {{group}} - {{groups.find((e)=>{return e.id==group}).name}}
                </li>
            </ul>
        </div>
    </b-col>
    <b-col cols="12" xl="2">
        <b-link class="btn btn-success" :to=" '/users/' + user.id + '/edit'">Редактировать</b-link>
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
                groups: null
            }
            try{
                var res = await context.$axios.get(context.env.backendUrl + '/users/' + id)
                data.user = res.data.user
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
    }
}
</script>