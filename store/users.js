import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
    table: {
        perPage: 25,
        currentPage: 1,
        filter: {
            mail: null,
            f: null,
            i: null,
            o: null,
            dt_birth_from: null,
            dt_birth_to: null,
            groups: []
        },

    }
})

export const getters = {
    getField
}

export const mutations = {
    updateField
}