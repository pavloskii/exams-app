import Vue from 'vue'
import Router from 'vue-router'

import Signup from '@/components/users/Signup';
import Signin from '@/components/users/SignIn';
import Dashboard from '@/components/exams/Dashboard';

import AuthGuard from './auth-guard';
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/signup', name: 'SignUp', component: Signup },
    { path: '/signin', name: 'SingIn', component: Signin },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, beforeEnter: AuthGuard },
  ]
})
