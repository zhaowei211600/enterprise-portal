var form = null,
    layer = null,
    element = null;

var productId = null;

$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element , upload = layui.upload;
        initialPage(form);

        form.on('submit(protocol)', function(data){
            //var productId = $("#productId").val();
            var protocol = $("#protocol").val();
            var protocolId = $("#protocolId").val();

            var params = {'id':protocolId,'productId': productId, 'content': protocol};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/protocol/save",
                type: "post",
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                beforeSend: function (request) {
                    request.setRequestHeader("OperaAuthorization", TOKEN);
                },
                success: function (resultData) {
                    if (resultData.returnCode == 200) {
                        x_admin_close();
                        parent.initPage(1, resultData.returnMessage);
                    } else {
                        layer.msg(resultData.returnMessage, {icon: 5, time:3000});
                    }
                },
                complete: function () {
                    layer.close(loadingIndex);
                }
            });
        });
    });
});

function initialPage(form) {
    productId = getUrlParam('productId');
    displayProtocol(productId, form);
}
/**
 * 编辑前回显
 * @param id
 */
function displayProtocol(productId, form) {
    if(!productId || '' == productId) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/protocol/find?productId=" + productId,
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                $("#protocol").val(resultData.data.content);
                $("#protocolId").val(resultData.data.id);
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}


