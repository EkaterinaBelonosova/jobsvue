import Vue from 'vue'
import Router from 'vue-router'
import Jobsbody from '@/components/Jobsbody'
import Preview from '@/components/Preview'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Jobsbody
    },
    {
      path: '/about/:id',
      name: 'about',
      props: true,
      component: Preview
    }
  ]
})
