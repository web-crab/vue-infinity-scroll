import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { linkText: 'Home' },
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      meta: { linkText: 'Blog' },
      component: () => import(/* webpackChunkName: "blog" */ '@/views/Blog.vue')
    }
  ]
})
