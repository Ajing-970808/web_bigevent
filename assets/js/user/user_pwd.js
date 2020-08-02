$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return layer.msg('新密码和旧密码不能相同')
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return layer.msg('密码不一致，请重新输入！')
            }
        }
    })

    // 判断原密码是否输入错误
    // 修改密码提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新密码失败！');
                layer.msg('恭喜您，修改密码成功！');
                // 更新成功后重置表单
                $('.layui-form')[0].reset();
                // 跳转到登录页面
                window.parent.location.href = '/login.html';
            }

        })
    })
})