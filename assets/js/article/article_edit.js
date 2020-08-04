$(function () {
    var layer = layui.layer;
    var form = layui.form;


    initEditor(); //文章内容富文本


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    // 打开编辑，文章标题，文章类别，文章内容显示对应的文字
    // console.log(location.search.split('=')[1]);
    var Id = location.search.split('=')[1];
    $.ajax({
        method: 'GET',
        url: '/my/article/' + Id,
        success: function (res) {
            // 渲染列表
            // 5. Id
            $('[name=Id]').val(res.data.Id);
            // 1.文章标题
            $('[name=title]').val(res.data.title);
            // 2.文章类别
            initCate(res.data.cate_id)
            // 3.文章内容
            setTimeout(function () {
                tinyMCE.activeEditor.setContent(res.data.content);
            }, 1000)
            // 4.文章封面
            $('#image').attr('src', baseURL + res.data.cover_img);
            // 这里的baseURL要在baseAPI里面设置，实际工作中的baseURL是不一样的
        }
    })


    // 定义文章发布状态
    var state = '已发布';
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form-edit').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', state);
        // 生成二进制图片
        $image
            .cropper('getCroppedCanvas', {
                // 创建Canvas画布
                width: 400,
                height: 280
            })
            // 将画布上的内容转换为文件对象
            .toBlob(function (blob) {
                // 将得到的二进制图片追加到fd中
                fd.append('cover_img', blob);
                editArticle(fd);
                // window.parent.parent.document.getElementById('a2').click();
            })
    })




    // 获取文章类别下拉框
    function initCate(cate_id) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('初始化文章分类失败');
                // 调用模板引擎
                res.cate_id = cate_id; //模板引擎，传递对象使用的是属性
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }


    // 定义发布文章的方法
    function editArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,

            success: function (res) {
                console.log(res);

                if (res.status !== 0) return layer.msg('发布文章失败！');
                layer.msg('发布文章成功！');
                location.href = '../../../article/article_list.html';
                window.parent.document.getElementById("a2").className = "layui-this";
                window.parent.document.getElementById("a3").className = "";
            }
        })
    }




})