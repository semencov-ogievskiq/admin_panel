<template>
  <b-row>
    <b-col cols="12">
      <h1>Пользователи</h1>
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
          <b-col md="6" lg="12">
            <b-form-group label-size="sm" label="Фамилия" label-align="center">
              <b-form-input id="F" v-model.trim="formFilter.f" size="sm" type="text" />
            </b-form-group>
          </b-col>
          <b-col md="6" lg="12">
            <b-form-group label-size="sm" label="Имя" label-align="center">
              <b-form-input id="I" v-model.trim="formFilter.i" size="sm" type="text" />
            </b-form-group>
          </b-col>
          <b-col md="6" lg="12">
            <b-form-group label-size="sm" label="Отчество" label-align="center">
              <b-form-input id="O" v-model.trim="formFilter.o" size="sm" type="text" />
            </b-form-group>
          </b-col>
          <b-col md="6" lg="12">
            <b-form-group label-size="sm" label="С даты рожденья">
              <b-form-datepicker id="fromDB" v-model.trim="formFilter.dt_birth_from" size="sm" placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
            </b-form-group>
          </b-col>
          <b-col md="6" lg="12">
            <b-form-group label-size="sm" label="По дату рожденья">
              <b-form-datepicker id="toDB" v-model.trim="formFilter.dt_birth_to" size="sm" placeholder="" :date-format-options="{day:'numeric',month:'numeric',year:'numeric'}" locale="ru"/>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group label-size="sm" label="Группы">
              <b-form-checkbox-group v-model="formFilter.groups" >
                <b-form-checkbox v-for="group in groups" :key="group.id" :value="group.id" v-b-tooltip.hover :title="group.description">{{group.name}}</b-form-checkbox>
              </b-form-checkbox-group>
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
          id="tableUsers"
          :items="usersProvider" 
          :fields="table.fields" 
          :filter="filter"
          :busy.sync="table.busy" 
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="currentPage" 
          :per-page="0" 
          hover responsive head-variant="dark" 
          :api-url="$root.context.env.backendUrl + '/users'"
          small
        >
          <!-- Блок Статуса -->
          <template #cell(status)="data">
            <span :class="(data.item.status)?'text-success':'text-danger'">
              <b-icon-circle-fill font-scale="0.7"/>
              {{(data.item.status)?'online':'offline'}}
            </span>
          </template>
          <!-- Блок действий -->
          <template #head(actions)="">
            <div class="text-right">
              <b-link class="text-light h5" @click="$root.$emit('bv::refresh::table','tableUsers')">
                <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
              </b-link>
            </div>
          </template>
          <template #cell(actions)="data">
            <nuxt-link class="text-success float-right" :to="'/users/'+data.item.id">
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
  // Локальное состояние 
  data(){
    return {
      formFilter: {
        mail: '',
        f: '',
        i: '',
        o: '',
        dt_birth_from: '',
        dt_birth_to: '',
        groups: []
      },
      table: {
        busy: false,
        totalRows: 0,
        fields: [
          {key: "status", label: "Статус", sortable:false},
          {key: "id", label: "id", sortable:true},
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
  // Глобальное состояние
  computed: {
    // Опции для запроса данных, храним в cache
    ... mapFields('cache/usersReqParams',{
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
    ...mapMutations('cache/usersReqParams',['setQueryDefault']),
    resetFilter(){
      this.formFilter = {
        mail: '',
        f: '',
        i: '',
        o: '',
        dt_birth_from: '',
        dt_birth_to: '',
        groups: []
      }
      this.setQueryDefault()
    },
    setFilters(){
      this.filter = { ... this.formFilter }
    },
    usersProvider: function(ctx){
      if( ctx.filter.dt_birth_from ) ctx.filter.dt_birth_from = moment( ctx.filter.dt_birth_from ).format( 'DD.MM.YYYY' )
      if( ctx.filter.dt_birth_to ) ctx.filter.dt_birth_to = moment( ctx.filter.dt_birth_to ).format( 'DD.MM.YYYY' )

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
  },
  created(){
    console.log(typeof $nuxt.$store.state.cache.usersReqParams.query.currentPage )
    console.log($nuxt.$store.state.cache.usersReqParams.query.currentPage)
    // При загрузке страницы задаем локальное состояние формы фильтрации, данными из cache
    this.formFilter = { ... this.filter }
  }
}
</script>