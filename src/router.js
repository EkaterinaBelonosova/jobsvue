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
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
     /*component: () => import('./views/About.vue')*/
      component: Preview
    }
  ]
})
