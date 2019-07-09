import Vue from 'vue'
import Vuex from 'vuex'
//vuex
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        nickName:'',
        cartCount:0,
    },
    mutations: {

        updateUserInf(state,nickName){
            state.nickName = nickName
        },

        updateCartCount(state,cartCount){
            state.cartCount += cartCount;
        },

        clearCartCount(state,cartCount){
            state.cartCount = cartCount;
        }
    }
});

export default store;