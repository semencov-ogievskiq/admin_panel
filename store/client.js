export const state = () =>({
    token: null,
    groups: [0]
})

export const mutations = {
    setToken (state,token){
        state.token = token
    },
    removeToken (state){
        state.token = null
    },
    getGroups (state){
        
    },
    removeGroups (state){
        state.groups = [0]
    }
}