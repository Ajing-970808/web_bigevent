$(function () {
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称应该输入1~6位'
            }
        }
    })
    initUserInfo();
    var layer = layui.layer;


    // 封装获取用户信息函数
    function initUserInfo() {
        $.ajax({
            // method: 'GET',//不写默认为GET请求方式
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 点击重置按钮
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('修改用户信息失败');
                layer.msg('用户信息修改成功');
                // 修改信息成功后，重新渲染用户头像和用户的信息
                // 刷新父框架里面的用户信息
                window.parent.getUserInfo();
            }
        })
    })
})