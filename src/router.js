import Vue from 'vue'
import Router from 'vue-router'
const login = () => import('./views/login/login')
const error = () => import('./views/error/error')
const orderList = () => import('./views/orderList/orderList')
const orderDetail = () => import('./views/orderDetail/orderDetail')
const upload = () => import('./views/orderDetail/controls/upload')
const cashUpload = () => import('./views/orderDetail/controls/cashUpload')
const hosRecUpload = () => import('./views/orderDetail/controls/hosRecUpload')
const advFundUpload = () => import('./views/orderDetail/controls/advFundUpload')
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail
    },
    {
      path: '/upload',
      name: 'upload',
      component: upload
    },
    {
      path: '/cashUpload',
      name: '上传结算费用明细',
      component: cashUpload
    },
    {
      path: '/hosRecUpload',
      name: '上传住院凭条',
      component: hosRecUpload
    },
    {
      path: '/advFundUpload',
      name: '提交押金垫付签署文件',
      component: advFundUpload
    },
    {
      path: '/errorinfo',
      name: 'errorinfo',
      component: error
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/errorinfo')
  } else {
    next()
  }
})

export default router;
