/*弹出层*/
/*
    参数解释：
    title   标题
    url     请求的url
    id      需要操作的数据id
    w       弹出层宽度（缺省调默认值）
    h       弹出层高度（缺省调默认值）
*/
var x_admin_show = function(title,url,w,h){
    if (title == null || title == '') {
        title=false;
    }
    if (url == null || url == '') {
        url="404.html";
    }
    if (w == null || w == '') {
        w=($(window).width()*0.9);
    }
    if (h == null || h == '') {
        h=($(window).height() - 50);
    }
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.open({
            type: 2,
            area: [w + 'px', h + 'px'],
            fix: false, //不固定
            maxmin: true,
            shadeClose: false,
            scrollbar: false, // 父页面 滚动条 禁止
            shade: 0.4,
            title: title,
            content: url
        });
    });
}

/*关闭弹出框口*/
var x_admin_close = function(){
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

/**
 * 关闭弹出框
 */
var close_pop_up = function(){
    $("#global_pop_up_div").parent().hide();
    $(".layui-layer-shade").removeClass("layui-layer-shade");
}

/**
 * 获取父页面URL形式的传参
 * @param name
 * @returns {*}
 */
var getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

/**
 * 显示【加载中】提示框
 */
var pop_up = function() {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.msg('加载中', {
            id : 'global_pop_up_div',
            icon : 16,
            shade : 0.3,
            time : 0,
            anim : 5
        });
    });
}