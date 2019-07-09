import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import axios from './axios/index.js'
import store from './store/index.js'
import vueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'


Vue.config.productionTip = false;

// axios 挂载到vue原型上
Vue.prototype.$http = axios;

//图片懒加载
Vue.use(vueLazyLoad,{
   loading:require('./assets/img/loading-bars.svg'),
    attempt:3
});


//滚动加载
Vue.use(infiniteScroll);

//引入base样式
import './assets/css/base.css'

new Vue({
    router: router,
    store: store,
    render: h => h(App),
}).$mount('#app');
