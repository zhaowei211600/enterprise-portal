var form = null,
    layer = null,
    element = null;
var checkOrderId, status;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element;
        checkOrderId = getUrlParam('id');

        form.on('submit(product)', function(data){
            var amount = $("#amount").val();

            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/check/settle?id="+checkOrderId+'&amount='+amount,
                type: "post",
                data: '',
                contentType: 'application/json;charset=UTF-8',
                beforeSend: function (request) {
                    request.setRequestHeader("OperaAuthorization", TOKEN);
                },
                success: function (resultData) {
                    if (resultData.returnCode == 200) {
                        x_admin_close();
                        parent.initialPage();
                    } else {
                        layer.msg(resultData.data, {icon: 5, time:3000});
                    }
                },
                complete: function () {
                    layer.close(loadingIndex);
                }
            });
        });
    });

});

