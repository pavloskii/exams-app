import auth from "./axios-auth";
import database from "axios";

export default {
    state: {
        idToken: null,
        userId: null,
        user: null
    },
    mutations: {
        authUser(state, userData) {
            state.idToken = userData.token;
            state.userId = userData.userId;
        },
        storeUser(state, user) {
            state.user = user;
        },
        clearAuthData(state) {
            state.idToken = null;
            state.userId = null;
        }
    },
    actions: {
        signup({ commit, dispatch }, authData) {
            auth
                .post("/signupNewUser?key=AIzaSyD20HO0pCPRCK2CC-j6tYueALGXg93ybD0", {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                })
                .then(res => {
                    commit('authUser', {
                        token: res.data.idToken,
                        userId: res.data.localId
                    });

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
                    localStorage.setItem('token', res.data.idToken);
                    localStorage.setItem('userId', res.data.localId);
                    localStorage.setItem('expirationDate', expirationDate);

                    dispatch('storeUser', authData);
                    dispatch('setLogoutTimer', res.data.expiresIn);
                })
                .catch(error => console.log("ERROR", error.response));
        },
        login({ commit, dispatch }, authData) {
            auth
                .post("/verifyPassword?key=AIzaSyCorS55BbYkpBA-ho9unYBlPIrP471gdmo", {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                })
                .then(res => {
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
                    localStorage.setItem('token', res.data.idToken);
                    localStorage.setItem('userId', res.data.localId);
                    localStorage.setItem('expirationDate', expirationDate);

                    commit('authUser', {
                        token: res.data.idToken,
                        userId: res.data.localId
                    });
                    dispatch('setLogoutTimer', res.data.expiresIn);
                })
                .catch(error => console.log("ERROR", error.response));
        },
        logout({ commit }) {
            commit('clearAuthData');

            localStorage.removeItem('expirationDate');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');

            router.replace('/signin');
        },
        tryAutoLogin({ commit }) {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const expirationDate = localStorage.getItem('expirationDate');
            const now = new Date();
            if (now >= expirationDate) {
                return;
            }
            const userId = localStorage.getItem('userId');
            commit('authUser', {
                token: token,
                userId: userId
            });
        },
        storeUser({ commit, state }, userData) {
            if (!state.idToken) {
                return;
            }
            database
                .post('/users.json' + '?auth=' + state.idToken, userData)
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