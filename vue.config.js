var webpack = require('webpack');
// var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    lintOnSave:false, // 取消代码检查
    productionSourceMap: false, // 是否生成 sourceMap 文件
    devServer: {
        port: 5980, //端口
        proxy:'http://192.168.2.15:3000',
    },
    configureWebpack:(config)=>{
        if (process.env.NODE_ENV === 'production') {
            //压缩、抽离第三方引用cdn
            /*config.plugins.push(new CompressionPlugin({ //Gzip压缩
                    algorithm: 'gzip',
                    test: /\.js$|\.html$|\.css$/,
                    threshold: 0.5,
                    minRatio: 0.8
                })
            );
            config.externals = { //抽离出来使用
                'vue': 'Vue',
                'vue-router':'VueRouter',
                'axios':'axios',
                'vue-lazyload':'VueLazyload',
                'vuex':'Vuex',
                'swiper':'Swiper'
            }*/
        }
    }
};
