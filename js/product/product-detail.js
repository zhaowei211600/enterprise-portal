var form = null,
    layer = null,
    element = null;
var checkOrderId, status, orderId;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element;
        initialPage(form)


    });

});

function initialPage(form) {
    checkOrderId = getUrlParam('id');
    orderId = getUrlParam('orderId');
    if(checkOrderId != 0) {
        getCheckOrderAttachment(checkOrderId , form);
        displayCheckDetail(checkOrderId,form)
    }else {
        $("#id").val('0');
    }
}
/**
 * 编辑前回显
 * @param id
 */
function displayCheckDetail(id, form) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/check/detail?id=" + id,
        data:'',
        contentType: 'application/json;charset=UTF-8',
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var product = resultData.data;
                $('#finishDesc').val(product.finishDesc)
                $("#auditDesc").val(product.auditDesc)

                if(product.status == '3'){
                    $('#status').val('拒绝')
                }else {
                    $('#status').val('通过')
                }

            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
function getCheckOrderAttachment(id, form) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/attachment/order/list",
        data:JSON.stringify({
            "checkOrderId":id,
            "pageNum":"1",
            "pageSize":"20"
        }),
        contentType: 'application/json;charset=UTF-8',
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var product = resultData.data;
                var list=''
                for(var i = 0; i < product.length; i++){
                    var item = product[i];
                    list +='<div><a href="'+baseUrl+'/user/file/stream?fileName='+item.filePath+'">'+item.fileName+'</a></div>'
                }
                $('#files').append(list)
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

