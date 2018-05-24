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
                    commit('storeUser', {
                        email: authData.email,
                        exams: {
                            taken: [],
                            created: []
                        }
                    });
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

                    dispatch('storeUserData', { email: authData.email });
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
                    commit('storeUser', {
                        email: authData.email,
                        exams: {
                            taken: [],
                            created: []
                        }
                    });
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
            commit('setLoading', true);

            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            const expirationDate = localStorage.getItem('expirationDate');
            const now = new Date();
            if (now >= expirationDate) {
                return;
            }

            const refreshToken = localStorage.getItem('refreshToken');
            const userId = localStorage.getItem('userId');
            commit('authUser', {
                token: token,
                userId: userId,
                refreshToken: refreshToken
            });
            commit('setLoading', false);
        },
        // refreshToken({ commit }) {
        //     commit('setLoading', true);
        //     axios.post("https://securetoken.googleapis.com/v1/token?key=AIzaSyD20HO0pCPRCK2CC-j6tYueALGXg93ybD0", {
        //         grant_type: "refresh_token",
        //         refresh_token: refreshToken,
        //     })
        //         .then(res => {
        //             commit('setLoading', false);
        //             commit('clearError');
        //             console.log(res)
        //             const now = new Date();
        //             const expirationDate = new Date(now.getTime() + res.data.expires_in * 1000);
        //             localStorage.setItem('token', res.data.id_token);
        //             localStorage.setItem('refreshToken', res.data.refresh_token);
        //             localStorage.setItem('expirationDate', expirationDate);

        //             commit('authUser', {
        //                 token: res.data.id_token,
        //                 userId: res.data.user_id,
        //                 refreshToken: res.data.refresh_token
        //             });
        //             commit('storeUser', {
        //                 email: authData.email,
        //                 exams: {
        //                     taken: [],
        //                     created: []
        //                 }
        //             });
        //         })
        //         .catch(error => {
        //             commit('setError', error.response.data.error);
        //             commit('setLoading', false);
        //             console.log("ERROR", error.response.data.error)
        //         });
        // },
        getCurrentUser({ commit, state }) {
            if (!state.idToken) {
                return;
            }
            database.post('/users.json' + '?auth=' + state.idToken)
                // '?auth=' + state.idToken, userData)
                .then(res => console.log(res))
                .catch(error => console.log(error.response));
        },
        storeUserData({ commit, state }, userData) {
            commit('setLoading', true);
            if (!state.idToken) {
                return;
            }
            database.put('/users/' + state.userId + '.json?auth=' + state.idToken, userData)
                .then(res => {
                    commit('setLoading', true);
                    console.log(res)
                })
                .catch(error => {
                    commit('setError', error.response.data.error);
                    commit('setLoading', false);
                    console.log("ERROR", error.response.data.error)
                });
        }
    },
    getters: {
        user(state) {
            return state.user;
        },
        isAuthenticated(state) {
            return state.idToken !== null;
        }
        // isTokenExpired(state) {
        //     const expirationDate = localStorage.getItem('expirationDate');
        //     if (!expirationDate) {
        //         return true;
        //     }

        //     return new Date() >= expirationDate;
        // }
    }
};