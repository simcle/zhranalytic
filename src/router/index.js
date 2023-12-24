import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/products',
    component: () => import('../views/products/indexProduct.vue'),
    children: [
      {
        path: '',
        name: 'Products',
        component: () => import('../views/products/ProductView.vue')
      }
    ] 
  },
  {
    path: '/analytic',
    name: 'Analytic',
    component: () => import('../views/analytic.vue')
  }, 
  {
    path: '/task-so',
    name: 'Task SO',
    component: () => import('../views/TaskSO.vue')
  },
  {
    path: '/consumptive',
    name: 'Consumptive',
    component: () => import('../views/consumptive.vue')
  }
]

const router = new VueRouter({
  scrollBehavior () {
		return {x: 0, y: 0, behavior: 'smooth'}
	},
	linkActiveClass: 'active',
	linkExactActiveClass: 'active',
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
