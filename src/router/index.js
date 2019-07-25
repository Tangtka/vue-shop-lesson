import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
const router = new Router({
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
        {
            path: '/',
            redirect: '/goods'
        },
        //商品列表
        {
            path: '/goods',
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
        },

        //订单确认页
        {
            path: '/orderConfirm',
            name: 'OrderConfirm',
            component: () => import('./../views/OrderConfirm.vue'),
        },

        //订单确提交
        {
            path: '/orderSuccess',
            name: 'OrderSuccess',
            component: () => import('./../views/OrderSuccess.vue'),
        }

    ]
});

// 判断是否需要登录权限以及是否登录
router.beforeEach((to, from, next) => {
    Vue.prototype.$http.GET('/api/users/checkLogin', {}, (respData) => {
        
        if(respData.status === '0'){
            next();
        } else {
            if(to.fullPath === '/goods'){
                next()
            } else {
                next({path: '/'})
            }
        }
    })
});


export default router;
