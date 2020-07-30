$(function () {
    // 绑定点击事件
    // 点击去注册账号，注册div显示，登录div隐藏
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })

    // 点击去登录，登录div显示，注册div隐藏
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 属性的值可以是数组，也可以是函数
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        // 确定密码校验规则
        rePwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) return '两次密码不一致！'
        }
    })


    // 监听注册事件
    $('#form-reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) return alert(res.message);
                // 注册成功
                layer.msg(res.message);
                $('#link_login').click(); //注册成功后跳转到登录页面
                $('#form_reg')[0].reset(); //清空注册页面的全部输入框
            }
        })
    })

    // 监听登录事件
    $('#form-login').on('submit', function (e) {
        e.preventDefault();
        // getLoginSuccess();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(), //快速获取表单中的数据
            // data: {
            //     username: $('#form-login [name=username]').val(),
            //     password: $('#form-login [name=password]').val()
            // },
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 保存token
                localStorage.setItem('token', res.token);
                location.href = 'index.html'; //跳转到大事件后台首页
            }
        })
    })

    // 封装一个登录函数
    function getLoginSuccess() {

    }
})