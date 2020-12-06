<template>
  <b-row>
    <b-col cols="12">
      <h1>Сессии</h1>
      <!-- Фильтрация -->
      <b-form @submit.prevent="">
        <b-form-row>
          <b-form-group class="col" label="Email" label-align="center">
            <b-form-input id="Email" v-model.trim="table.filter.mail" size="sm" type="text" />
          </b-form-group>
          <b-form-group class="col" label="Время открытия от">
            <b-form-datepicker id="fromDB" v-model.trim="table.filter.iatFrom" size="sm" placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
          </b-form-group>
          <b-form-group class="col" label="Время открытия до">
            <b-form-datepicker id="toDB" v-model.trim="table.filter.iatTo" size="sm" placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
          </b-form-group>
        </b-form-row>
      </b-form>
      <!-- Таблица -->
      <b-table 
        :items="usersProvider" 
        :fields="table.fields" 
        :filter="table.filter"
        :busy.sync="table.busy" 
        :current-page="table.currentPage" 
        :per-page="table.perPage" 
        hover responsive head-variant="dark" 
        :api-url="$root.context.env.backendUrl + '/users/sessions'"
        small
      >
        <!-- Блок ФИО -->
        <template #cell(mail)="data">
          <b-link :to="'/users/' + data.item.id_user" target="_blank" v-b-tooltip.hover :title=" data.item.f + ' ' + data.item.i + ' ' + data.item.o ">{{data.item.mail}}</b-link>
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
import moment from 'moment'

export default {
  data: function(){
    return {
      table:{
        items: [],
        busy: false,
        perPage: 25,
        currentPage: 1,
        totalRows: 0,
        filter: {
          mail: null,
          iatFrom: null,
          iatTo: null
        },
        fields: [
          {key: "id", label: "id", sortable:true},
          {key: "mail", label: "Email", sortable: true},
          {key: "browser", label: "Браузер", sortable:true},
          {key: "os", label: "ОС", sortable:true},
          {key: "ip", label: "Ip адрес", sortable:true},
          {key: "iat", label: "Время открытия", sortable:true},
          {key: "exp", label: "Время истичения", sortable:true},
        ]
      },
      groups: []
    }
  },
  methods: {
    usersProvider: function(ctx){
      if( ctx.filter.iatFrom ) ctx.filter.iatFrom = moment( ctx.filter.iatFrom ).format( 'DD.MM.YYYY' )
      if( ctx.filter.iatTo ) ctx.filter.iatTo = moment( ctx.filter.iatTo ).format( 'DD.MM.YYYY' )

      return this.$axios.get( ctx.apiUrl, {
        params: {
          page: ctx.currentPage,
          perPage: ctx.perPage,
          sortBy: ctx.sortBy,
          sortDesc: ctx.sortDesc,
          filter: ctx.filter
        }
      })
                .then((res)=>{
                  if(res.data.count && res.data.result){
                    this.table.totalRows = res.data.count
                    return res.data.result
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