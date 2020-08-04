$(function () {
    // 渲染文章分类列表
    initArtCateList();

    var form = layui.form;
    var layer = layui.layer;

    // 添加类别  
    // 弹出弹出层
    var indexAdd = null;
    $('#addCates').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: "添加文章分类",
            content: $('#dialog-add').html(), //这里content是一个普通的String
        });
    })
    // 通过代理的方式给form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('新增分类失败');
                initArtCateList();
                layer.msg('新增分类成功');
                layer.close(indexAdd)
            }
        })
    })


    // 编辑
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: "修改文章分类",
            content: $('#dialog-edit').html(),
        });
        var id = $(this).attr('data-Id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // if (res.status !== 0) return layer.msg('修改文章失败');
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的方式给修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('修改文章数据失败');
                initArtCateList();
                layer.msg('修改文章数据成功');
                layer.close(indexEdit)
            }
        })
    })





    // 删除
    var indexDel = null;
    $('tbody').on('click', '#btn-del', function () {
        var id = $(this).attr('data-Id');
        indexDel = layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除分类失败');
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })



    // 封装获取文章分类列表函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').empty().html(htmlStr);
            }
        })
    }
})