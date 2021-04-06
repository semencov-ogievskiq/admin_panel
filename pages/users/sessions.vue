<template>
  <b-row>
    <b-col cols="12">
      <h1>Сессии пользователей</h1>
    </b-col>
    <!-- Форма фильтрации -->
    <b-col order-lg="2" xl="2" lg="2">
      <b-form @submit.prevent="setFilters" @reset.prevent="resetFilter">
        <b-form-row>
          <b-col md="6" lg="12">
            <b-form-group label-size="sm" label="Email" label-align="center">
              <b-form-input id="Email" v-model.trim="formFilter.mail" size="sm" type="text" />
            </b-form-group>
          </b-col>
          <b-col md="3" lg="12">
            <b-form-group label-size="sm" label="Время открытия от" label-align="center">
              <b-form-datepicker id="iatFrom" v-model.trim="formFilter.iatFrom" size="sm" type="text" placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
            </b-form-group>
          </b-col>
          <b-col md="3" lg="12">
            <b-form-group label-size="sm" label="Время открытия до" label-align="center">
              <b-form-datepicker id="iatTo" v-model.trim="formFilter.iatTo" size="sm" type="text" placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
            </b-form-group>
          </b-col>
          <b-col offset-md="6" md="3" offset-lg="0" lg="12">
            <b-button variant="light" class="w-100 my-1" type="reset">Сбросить</b-button>
          </b-col>
          <b-col md="3" lg="12">
            <b-button  variant="primary" class="w-100 my-1" type="submit">Применить</b-button>
          </b-col>
        </b-form-row>
      </b-form>
    </b-col>
    <!-- Таблица данных -->
    <b-col order-lg="1" xl="10" lg="10">
      <b-table 
        id="tableSessions"
        :items="sessionsProvider" 
        :fields="table.fields" 
        :filter="filter"
        :busy.sync="table.busy" 
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :current-page="currentPage" 
        :per-page="0" 
        hover responsive head-variant="dark" 
        :api-url="$root.context.env.backendUrl + '/users/sessions'"
        small
      >
        <!-- Блок ФИО -->
        <template #cell(mail)="data">
          <b-link :to="'/users/' + data.item.id_user" v-b-tooltip.hover :title=" data.item.f + ' ' + data.item.i + ' ' + data.item.o ">{{data.item.mail}}</b-link>
        </template>
        <!-- Загрузка данных-->
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Загрузка...</strong>
          </div>
        </template>
      </b-table>

      <b-pagination v-if="table.totalRows/perPage>=2"
        pills
        align="center"
        v-model.lazy="currentPage"
        :total-rows="table.totalRows"
        :per-page="perPage"
      ></b-pagination>
    </b-col>
  </b-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  data: function(){
    return {
      formFilter: {
        mail: null,
        iatFrom: null,
        iatTo: null
        },
      table:{
        busy: false,
        totalRows: 0,
        fields: [
          {key: "id", label: "id", sortable:true},
          {key: "mail", label: "Email", sortable: true},
          {key: "browser", label: "Браузер", sortable:true},
          {key: "os", label: "ОС", sortable:true},
          {key: "ip", label: "Ip адрес", sortable:true},
          {key: "iat", label: "Время открытия", sortable:true},
          {key: "exp", label: "Время истичения", sortable:true},
        ]
      }
    }
  },
  computed: {
    ... mapFields('cache/sessionsReqParams',{
      perPage: 'query.perPage',      // Всего элементов на странице
      currentPage: 'query.currentPage',  // Текущая страница
      sortBy: 'query.sortBy',       // Сортировка по столбцу
      sortDesc: 'query.sortDesc',     // Обратная сортировка (bolean)
      filter: 'query.filter'        // Фильрация данных
    }),
    // Список всех существующих групп
    groups(){
      return this.$store.state.dict.groups
    }
  },
  methods: {
    ...mapMutations('cache/sessionsReqParams',['setQueryDefault']),
    resetFilter(){
      this.formFilter = {
        mail: null,
        iatFrom: null,
        iatTo: null
      }
      this.setQueryDefault()
    },
    setFilters(){
      this.filter = { ... this.formFilter }
    },
    sessionsProvider: function(ctx){
      if( ctx.filter.iatFrom ) ctx.filter.iatFrom = moment( ctx.filter.iatFrom ).format( 'DD.MM.YYYY' )
      if( ctx.filter.iatTo ) ctx.filter.iatTo = moment( ctx.filter.iatTo ).format( 'DD.MM.YYYY' )

      return this.$axios.get( ctx.apiUrl, {
        params: {
          page: ctx.currentPage,
          perPage: this.perPage,
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
  },
  created(){
    // При загрузке страницы задаем локальное состояние формы фильтрации, данными из cache
    this.formFilter = { ... this.filter }
  }
}
</script>