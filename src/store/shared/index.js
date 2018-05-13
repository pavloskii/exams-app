export default {
    state: {
        loading: false,
        error: null,
        pageTitle: ""
    },
    mutations: {
        setLoading(state, payload) {
            state.loading = payload;
        },
        setError(state, payload) {
            state.error = payload;
        },
        clearError(state) {
            state.error = null;
        },
        setPageTitle(state, payload){
            state.pageTitle = payload;
        }
    },
    actions: {
        clearError({ commit }) {
            commit('clearError');
        },
        setPageTitle({ commit }, payload) {
            commit('setPageTitle', payload);
        }
    },
    getters: {
        loading(state) {
            return state.loading;
        },
        error(state) {
            return state.error;
        },
        pageTitle(state) {
            return state.pageTitle;
        }
    }
};