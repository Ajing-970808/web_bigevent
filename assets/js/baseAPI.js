// 拦截 / 过滤 每次请求， 配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})