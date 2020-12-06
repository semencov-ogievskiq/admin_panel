import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
    query: {
        perPage: 25,
        currentPage: 1,
        sortBy: "id",
        sortDesc: true,
        filter: {
            mail: '',
            f: '',
            i: '',
            o: '',
            dt_birth_from: '',
            dt_birth_to: '',
            groups: []
        }
    }  
})

export const getters = {
    getField
}

export const mutations = {
    updateField,
    setQueryDefault( state ){
        state.query = {
            perPage: 25,
            currentPage: 1,
            sortBy: "id",
            sortDesc: true,
            filter: {
                mail: '',
                f: '',
                i: '',
                o: '',
                dt_birth_from: '',
                dt_birth_to: '',
                groups: []
            }
        }
    }
}