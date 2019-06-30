<template>
    <div id="GoodsList">
        <NavHeader></NavHeader>
        <NavBread></NavBread>

        <div class="accessory-result-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">排序:</span>
                    <a href="javascript:void(0)" class="default cur">默认</a>
                    <a href="javascript:void(0)" class="price">价格
                        <svg class="icon icon-arrow-short">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" class="filterby" @click.stop = "showFilterPop()">筛选</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter" id="filter" :class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>价格区间:</dt>
                            <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceChecked === 'all'}">选择价格</a></dd>
                            <dd v-for="(item,index) in priceFilter" :key="item.index">
                                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked === index}">￥ {{item.startPrice}} - {{item.endPrice}} 元</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="item in goodsList" :key="item.productId">
                                    <div class="pic">
                                        <a href="#"><img :src="item.productImage" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop()"></div>
        <NavFooter></NavFooter>
    </div>
</template>

<script>
    import '../assets/css/goods-list.css'

    import NavHeader from '../components/NavHeader.vue'
    import NavBread from '../components/NavBread.vue'
    import NavFooter from '../components/NavFooter.vue'

    export default {
        name: 'GoodsList',
        components: {
            NavHeader, NavBread, NavFooter
        },
        data() {
            return {
                goodsList: [],
                priceFilter:[
                    {
                        startPrice:'0.00',
                        endPrice:'100.00'
                    },
                    {
                        startPrice:'100.00',
                        endPrice:'500.00'
                    },
                    {
                        startPrice:'500.00',
                        endPrice:'1000.00'
                    },
                    {
                        startPrice:'1000.00',
                        endPrice:'2000.00'
                    },
                    {
                        startPrice:'2000.00',
                        endPrice:'3000.00'
                    },
                    {
                        startPrice:'3000.00',
                        endPrice:'6000.00'
                    }
                ],
                priceChecked:'all',
                filterBy:false,
                overLayFlag:false,
            }
        },
        mounted() {
            this.getGoodsList();
        },
        methods: {
            //获取商品列表
            getGoodsList() {
                this.$http.GET('/goods', {}, (respData) => {
                    this.goodsList = respData.result;
                })
            },

            //过滤价格
            setPriceFilter(index){
                this.priceChecked = index;
            },

            //移动端显示筛选
            showFilterPop(){
                this.filterBy = true;
                this.overLayFlag = true;
            },

            //关闭筛选
            closePop(){
                this.filterBy = false;
                this.overLayFlag = false;
            }
        },
    }
</script>

<style scoped>

</style>