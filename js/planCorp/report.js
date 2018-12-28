localStorage;
$(document).ready(function(){
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        initView();
        layui.use('code', function(){
            layui.code({
                about: false
            });
        });
    });
});

function initView() {
    var result = localStorage.getItem("report");
    $("#data-report").append(result);
    //清空数据
    localStorage.removeItem("report");
}

