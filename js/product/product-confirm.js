var form = null,
    layer = null,
    element = null;
var checkOrderId, status, orderId;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element;
        initialPage(form)

        form.on('submit(product)', function(data){
            var id = checkOrderId;
            var status = $("#status").val();
            var auditDesc = $("#realCost").val();
            var params = {'id': id, 'auditDesc': auditDesc, 'status': status};

            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/check/audit",
                type: "post",
                data: JSON.stringify(params),
                contentType: 'application/json;charset=UTF-8',
                beforeSend: function (request) {
                    request.setRequestHeader("OperaAuthorization", TOKEN);
                },
                success: function (resultData) {
                    if (resultData.returnCode == 200) {
                        x_admin_close();
                        parent.getWaitCheckList(checkOrderId, 1);
                        parent.getCheckHistoryList(checkOrderId, 1);
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

function initialPage(form) {
    checkOrderId = getUrlParam('id');
    orderId = getUrlParam('orderId');
    if(checkOrderId != 0) {
        getOrderAttachment(orderId , form);
        var descArr = JSON.parse(localStorage.getItem('finishDesc'))
        for (var item of descArr){
            if (item.id == checkOrderId){
                $('#deliveryDesc').val(item.finishDesc)
                return;
            }
        }
    }else {
        $("#id").val('0');
    }
}
/**
 * 编辑前回显
 * @param id
 */
function getOrderAttachment(id, form) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/attachment/order/list",
        data:JSON.stringify({
            "orderId":id,
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
                var fileList = resultData.data;
                if(fileList.length > 0){
                    var list=''
                    for(var item of product){
                        list +='<div><a href="'+baseUrl+'/user/file/stream?fileName='+item.filePath+'">'+item.fileName+'</a></div>'
                    }
                    $('#files').append(list)
                }

            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

