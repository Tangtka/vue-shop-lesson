import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition //记录路由滚动位置
        } else {
            //使用keep
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop

            }
            return {x: 0, y: to.meta.savedPosition || 0}
            //不是用keep
            //return { x: 0, y: 0 }
        }
    },
    routes: [
        //商品列表
        {
            path: '/',
            name: 'GoodsList',
            component: () => import('./../views/GoodsList.vue'),
        },

        //购物车页面
        {
            path: '/cart',
            name: 'Cart',
            component: () => import('./../views/Cart.vue'),
        },

        //收货地址
        {
            path: '/address',
            name: 'Address',
            component: () => import('./../views/Address.vue'),
        }

    ]
})
