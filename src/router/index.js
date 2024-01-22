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
    path: '/purchasing',
    component: () => import('../views/purchasing/index.vue'),
    children: [
      {
        path: '',
        name: 'Purchasing',
        component: () => import('../views/purchasing/purchasing.vue')
      },
      {
        path: 'new',
        name: 'New Pruchasing',
        component: () => import('../views/purchasing/newPurchasing.vue'),
      },
      {
        path: 'detail/:id',
        name: 'Detail',
        component: () => import('../views/purchasing/detailPurchase.vue')
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
    path: '/report',
    name: 'Report',
    component: () => import('../views/report.vue')
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
