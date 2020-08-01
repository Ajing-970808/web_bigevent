// 拦截 / 过滤 每次请求， 配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 统一为有权限的接口设置headers请求头
    // url里面包含/my需要加headers
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }


    // 全局统一挂载complete回调函数   所有的请求完成后进行身份认证判断
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token'); //强制清空token
            location.href = '/login.html'; //跳转到登录页面
        }
    }
})