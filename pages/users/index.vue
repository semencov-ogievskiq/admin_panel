<template>
  <b-row>
    <b-col cols="12">
      <h1>Пользователи</h1>
    </b-col>
    <b-col cols="12" order-md="9" md="3" lg="2" xl="2">
      <!-- Right Menu -->
      <b-button>Зарегистрировать</b-button>
    </b-col>
    <b-col cols="12" order-md="3" md="9" lg="10" xl="10">
      <!-- Table -->
      <b-table 
        :items="usersProvider" 
        :fields="table.fields" 
        :busy.sync="table.busy" 
        :current-page="table.currentPage" 
        :per-page="table.perPage" 
        hover responsive head-variant="dark" 
        :api-url="$root.context.env.backendUrl + '/users'"
      >
        <!-- Блок действий -->
        <template #cell(actions)="data">
          <nuxt-link class="text-success" :to="'/users/'+data.item.id">
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
          {key: "id", label: "#", sortable:false},
          {key: "f", label: "Фамилия", sortable:true},
          {key: "i", label: "Имя", sortable:true},
          {key: "o", label: "Отчество", sortable:true},
          {key: "mail", label: "Почта", sortable:true},
          {key: "dt_birth", label: "Дата рождения", sortable:true},
          {key: "actions", label: "", sortable:false},
        ]
      }
    }
  },
  methods: {
    usersProvider: function(ctx){
      return this.$axios.get( ctx.apiUrl, {
        params: {
          page: this.table.currentPage,
          perPage: this.table.perPage
        }
      })
                .then((res)=>{
                  if(res.data.count && res.data.users){
                    this.table.totalRows = res.data.count
                    return res.data.users
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
  }
}
</script>