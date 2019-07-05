import Vue from 'vue';
import Axios from 'axios';
import qs from 'qs';

const baseUrl = 'http://localhost:3000';
const fileUploadUrl = '';
const fileProjectName = '';
const baseImgUrl = 'http://pegasus.org.cn:59889';

const axios = Axios.create({
    baseURL: baseUrl,
    transformRequest: [function (data) {
        data = qs.parse(data);
        data = qs.stringify(data);
        return data;
    }],
    withCredentials: true //携带cookie
});

/**
 * 异步请求数据GET
 * @param url
 * @param params
 * @param callback
 * @param err
 */
const get = (url, params, callback, err) => {

    axios.get(url, {params: params}).then((response) => {
        callback(response.data);
    }).catch((error) => {
        if (typeof (err) == "undefined") {
            requestError(error);
        } else {
            err(error);
        }
    });
};


/**
 * 异步请求数据POST
 * @param url
 * @param params
 * @param callback
 * @param err
 */
const post = (url, params, callback, err) => {

    axios.post(url, params).then((response) => {
        callback(response.data);
    }).catch((error) => {
        if (typeof (err) == "undefined") {
            requestError(error);
        } else {
            err(error);
        }
    });
};


/**
 * 异步上传文件
 * @param path
 * @param files
 * @param callBackFun
 * @param listenerFun
 * @param errorFun
 */
const uploadFile = (path, files, callBackFun, listenerFun, errorFun) => {
    // 请求参数
    var formData = new FormData();
    for (var i = 0, len = files.length; i < len; i++) {
        formData.append('file', files[i]);
    }

    // 上传文件
    Axios({
        url: fileUploadUrl + '?path=/' + fileProjectName + path + '&encoding=UTF-8&rename=true&overwrite=true&empty=false',
        method: 'post',
        onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
            if (progressEvent.lengthComputable && typeof (listenerFun) != "undefined") {
                //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                listenerFun(progressEvent)
            }
        },
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData
    }).then(function (response) {
        callBackFun(response.data)
    }).catch(function (error) {
        if (typeof (errorFun) == "undefined") {
            this.requestError(error);
        } else {
            errorFun(error);
        }
    });
};

const requestError = (error) => {
    console.log("服务器繁忙，请稍后重试");
};

export default {
    GET : get,
    POST : post,
    uploadFile : uploadFile,
    baseImgUrl:baseImgUrl,

}
// Vue.prototype.GET = get;
// Vue.prototype.POST = post;
// Vue.prototype.uploadFile = uploadFile;