import auth from "../axios-instaces/axios-auth";
import database from "../axios-instaces/axios-database";
import axios from "axios";

export default {
    state: {
        idToken: null,
        refreshToken: null,
        userId: null,
        user: null
    },
    mutations: {
        authUser(state, userData) {
            state.idToken = userData.token;
            state.userId = userData.userId;
            state.refreshToken = userData.refreshToken;
        },
        storeUser(state, user) {
            state.user = user;
        },
        clearAuthData(state) {
            state.idToken = null;
            state.userId = null;
            state.refreshToken = null,
                user = null
        }
    },
    actions: {
        signup({ commit, dispatch }, authData) {
            commit('setLoading', true);

            auth.post("/signupNewUser?key=AIzaSyD20HO0pCPRCK2CC-j6tYueALGXg93ybD0", {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            })
                .then(res => {
                    commit('setLoading', false);
                    commit('clearError');
                    commit('storeUser', { email: authData.email });
                    commit('authUser', {
                        token: res.data.idToken,
                        userId: res.data.localId,
                        refreshToken: res.data.refreshToken
                    });
                    console.log(res);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
                    localStorage.setItem('token', res.data.idToken);
                    localStorage.setItem('userId', res.data.localId);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    localStorage.setItem('expirationDate', expirationDate);

                    dispatch('storeUser', { email: authData.email });
                    // dispatch('setLogoutTimer', res.data.expiresIn);
                })
                .catch(error => {
                    commit('setError', error.response.data.error);
                    commit('setLoading', false);
                    console.log("ERROR", error.response)
                });
        },
        login({ commit, dispatch }, authData) {
            commit('setLoading', true);
            auth.post("/verifyPassword?key=AIzaSyD20HO0pCPRCK2CC-j6tYueALGXg93ybD0", {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            })
                .then(res => {
                    commit('setLoading', false);
                    commit('clearError');

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
                    localStorage.setItem('token', res.data.idToken);
                    localStorage.setItem('userId', res.data.localId);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    localStorage.setItem('expirationDate', expirationDate);

                    commit('authUser', {
                        token: res.data.idToken,
                        userId: res.data.localId,
                        refreshToken: res.data.refreshToken
                    });
                    commit('storeUser', { email: authData.email });
                    // dispatch('setLogoutTimer', res.data.expiresIn);
                })
                .catch(error => {
                    commit('setError', error.response.data.error);
                    commit('setLoading', false);
                    console.log("ERROR", error.response.data.error)
                });
        },
        logout({ commit }) {
            commit('clearAuthData');

            localStorage.removeItem('expirationDate');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');

            router.replace('/signin');
        },
        tryAutoLogin({ commit, dispatch }) {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const expirationDate = localStorage.getItem('expirationDate');
            const now = new Date();
            const refreshToken = localStorage.getItem('refreshToken');
            if (now >= expirationDate) {
                axios.post("https://securetoken.googleapis.com/v1/token?key=AIzaSyD20HO0pCPRCK2CC-j6tYueALGXg93ybD0", {
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                })
                    .then(res => {
                        commit('setLoading', false);
                        commit('clearError');
                        console.log(res)
                        const now = new Date();
                        const expirationDate = new Date(now.getTime() + res.data.expires_in * 1000);
                        localStorage.setItem('token', res.data.id_token);
                        localStorage.setItem('refreshToken', res.data.refresh_token);
                        localStorage.setItem('expirationDate', expirationDate);

                        commit('authUser', {
                            token: res.data.id_token,
                            userId: res.data.user_id,
                            refreshToken: res.data.refresh_token
                        });
                        commit('storeUser', { email: "profile" });
                    })
                    .catch(error => {
                        commit('setError', error.response.data.error);
                        commit('setLoading', false);
                        console.log("ERROR", error.response.data.error)
                    });

                // return;
            } else {
                const userId = localStorage.getItem('userId');
                commit('authUser', {
                    token: token,
                    userId: userId,
                    refreshToken: refreshToken
                });
            }

            dispatch('getCurrentUser');
        },
        getCurrentUser({ commit, state }) {
            if (!state.idToken) {
                return;
            }
            database.post('/users.json' + '?auth=' + state.idToken)
                // '?auth=' + state.idToken, userData)
                .then(res => console.log(res))
                .catch(error => console.log(error.response));
        },
        storeUser({ commit, state }, userData) {
            if (!state.idToken) {
                return;
            }
            database.post('/users' + '?auth=' + state.idToken, userData)
                .then(res => console.log(res))
                .catch(error => console.log(error));
        }
    },
    getters: {
        user(state) {
            return state.user;
        },
        isAuthenticated(state) {
            return state.idToken !== null;
        }
    }
};