import Vue from 'vue';
import Vuex from 'vuex';

import auth from './users';
import shared from './shared';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        auth: auth,
        shared: shared
    }
});