<template>
  <b-row>
    <b-col cols="12">
      <h1>Группы</h1>
      <!-- Таблица -->
      <b-table 
        :items="usersProvider" 
        :fields="table.fields" 
        :busy.sync="table.busy" 
        :current-page="table.currentPage" 
        :per-page="table.perPage" 
        hover responsive head-variant="dark" 
        :api-url="$root.context.env.backendUrl + '/users/groups'"
        small
      >
        <!-- Блок действий -->
        <template #cell(actions)="data">
          <nuxt-link class="text-success" :to="'/groups/'+data.item.id">
            <b-icon-search></b-icon-search>
          </nuxt-link>
        </template>
        <!-- Загрузка данных-->
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Загрузка...</strong>
          </div>
        </template>
      </b-table>
      <!-- Пагинация -->
      <b-pagination v-show="table.totalRows/table.perPage>=2"
        pills
        align="center"
        v-model="table.currentPage"
        :total-rows="table.totalRows"
        :per-page="table.perPage"
      ></b-pagination>
    </b-col>
  </b-row>
</template>

<script>
export default {
  data: function(){
    return {
      table:{
        items: [],
        busy: false,
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        fields: [
          {key: "id", label: "#", sortable:true},
          {key: "name", label: "Название", sortable:true},
          {key: "description", label: "Описание"},
          {key: "actions", label: "", sortable:false},
        ]
      }
    }
  },
  methods: {
    usersProvider: function(ctx){
      return this.$axios.get( ctx.apiUrl, {
        params: {
          page: ctx.currentPage,
          perPage: ctx.perPage,
          sortBy: ctx.sortBy,
          sortDesc: ctx.sortDesc
        }
      })
                .then((res)=>{
                  if(res.data.count && res.data.groups){
                    this.table.totalRows = res.data.count
                    return res.data.groups
                  }else{
                    this.table.totalRows = 0
                    return []
                  }                  
                })
                .catch((err)=>{
                  console.log(err)
                  this.table.totalRows = 0
                  return []
                })
    }
  },
  mounted(){
    this.$root.$socket.on('changedGroup', ()=>{
      this.$root.$emit("bv::refresh::table")
    })
  }
}
</script>