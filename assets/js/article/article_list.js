$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;



    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear(),
            m = padZero(dt.getMonth() + 1),
            d = padZero(dt.getDate()),
            hh = padZero(dt.getHours()),
            mm = padZero(dt.getMinutes()),
            ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }


    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable();
    initCate();


    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })


    // 删除
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id');
        var len = $('.btn-del').length;
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除文章失败！');
                    layer.msg('删除文章成功！')
                    // 数据删除后，判断当前页是否有剩余数据，无数据，页码值-1再调用initTable()
                    // len === 1 && q.pagenum > 1 && q.pagenum--  前两个进行判断，后一个进行运算
                    if (len === 1) {
                        // len等于1，删除后，页面上没有数据
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })

    $('tbody').on('click', '.btn-edit', function () {})




    // 封装获取列表函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取列表页面失败');
                var htmlStr = template('tpl-table', res);
                $('tbody').empty().html(htmlStr);
                // res.total   数据的条数
                renderPage(res.total);
            }
        })
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取分类数据失败')
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').empty().html(htmlStr);
                // 通过layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }


    // 封装获取页码的函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 分页发生切换的时候，触发jump回调
            jump: function (obj, first) {
                // console.log(obj.curr);
                // console.log(obj.limit);
                q.pagenum = obj.curr; //最新的页码值赋值给q这个查询参数对象中


                q.pagesize = obj.limit; //最新的条目数赋值给q这个查询参数对象的pagesize属性中
                // initTable(); //根据最新的q获取对应的数据列表，渲染表格
                // initTable()直接调用会发生死循环  
                // 触发jump回调有两种方式
                // 1.点击页码时
                // 2.调用了laypage.render()方法
                // 通过first的值，判断通过哪种方式触发的jump
                // first为true。证明是方式2触发，否则是方式1触发的
                if (!first) {
                    initTable();
                }
            }
        });
    }
})