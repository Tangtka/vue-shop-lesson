<template>
    <div id="OrderSuccess">
        <NavHeader></NavHeader>
        <NavBread>
            <span>下单成功</span>
        </NavBread>

        <div class="container">
            <div class="page-title-normal">
                <h2 class="page-title-h2"><span>订单提交成功，请尽快付款！</span></h2>
            </div>
            <!-- 进度条 -->
            <div class="check-step">
                <ul>
                    <li class="cur"><span>确认</span> 收货地址</li>
                    <li class="cur"><span>核对</span> 订单信息</li>
                    <li class="cur"><span>支付</span> 方式</li>
                    <li class="cur"><span>成功提交</span> 订单</li>
                </ul>
            </div>

            <div class="order-create">
                <div class="order-create-pic"><img src="../assets/img/ok-2.png" alt=""></div>
                <div class="order-create-main">
                    <h3>恭喜! <br>订单提交成功，请尽快付款！</h3>
                    <p>
                        <span>订单号：{{orderId}}</span>
                        <span>应付金额：{{orderTotal | currency}}</span>
                    </p>
                    <div class="order-create-btn-wrap">
                        <div class="btn-l-wrap">
                            <router-link class="btn btn--m" to="/cart">购物车列表</router-link>
                        </div>
                        <div class="btn-r-wrap">
                            <router-link class="btn btn--m" to="/">商品列表</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <NavFooter></NavFooter>
    </div>
</template>

<script>
    import '../assets/css/checkout.css'

    import NavHeader from '../components/NavHeader.vue'
    import NavBread from '../components/NavBread.vue'
    import NavFooter from '../components/NavFooter.vue'
    import Modal from '../components/Modal.vue'

    import {currency} from '../util/currency.js'
    export default {
        name: 'OrderSuccess',
        components: {
            NavHeader, NavBread, NavFooter, Modal
        },
        data() {
            return {
                orderId:'',
                orderTotal:0
            }
        },
        mounted() {
            this.orderId = this.$route.query.orderId;
            this.getOrderDetail();
        },
        filters:{
            currency:currency
        },
        methods: {
            //订单信息
            getOrderDetail(){
                var orderId = this.$route.query.orderId;

                this.$http.POST('/users/orderDetail', {
                    orderId:this.orderId
                }, (respData) => {
                    if (respData.status === '0') {
                        this.orderId = orderId;
                        this.orderTotal = respData.result.orderTotal;
                    } else {
                        console.log(respData.msg)
                    }
                })
            },
        },
    }
</script>

<style scoped>

</style>