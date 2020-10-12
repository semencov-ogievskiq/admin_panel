<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">
          Пользователи
        </h1>
      </div>
      <div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <b-table :items="table.items" :fields="table.fields">

        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      table:{
        items: [],
        fields: [
          {key: "id", label: "#", sortable:false},
          {key: "f", label: "Фамилия", sortable:true},
          {key: "i", label: "Имя", sortable:true},
          {key: "o", label: "Отчество", sortable:true},
          {key: "mail", label: "Почта", sortable:true},
          {key: "dt_birth", label: "Дата рождения", sortable:true},
        ]
      },
      users: [ // Значения таблицы
        {age: 43},
        {age: 23}
      ],
      t_header: [{key: "age", label: "Возраст", sortable:true,}] // Шапка таблицы
    }
  },
  methods: {
    getItems: async function(){
      let url = this.$root.context.env.backendUrl + '/users'
      this.$axios.get( url )
        .then((res)=>{
          this.table.items = res.data
        })
    }
  },
  mounted: function(){
    this.getItems()
  }
}
</script>