$(function () {
    // 获取用户信息
    getUserInfo();


    var layer = layui.layer;



    // 退出功能
    $('#btnLogout').on('click', function () {
        // 用户按退出按钮提示用户是否退出
        layer.confirm('确定退出登录？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            layer.close(index); //关闭提示框
            localStorage.removeItem('token'); //删除本地token
            location.href = '/login.html'; //跳转到首页
        })
        console.log('ok');
    })




})

// 获取用户信息函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token') || ''
        }, //请求头配置对象
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message);
            // 渲染用户头像信息
            renderAvatar(res.data);
        }
    })
}

// 封装渲染用户头像
function renderAvatar(user) {
    // 渲染用户名
    var uName = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uName);
    // 判断，用户头像信息  有渲染图片，没有渲染文字
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        // 获取用户名的第一个字，渲染成头像   大写
        $('.text-avatar').show().html(uName[0].toUpperCase());
    }
}