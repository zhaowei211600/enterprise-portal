var form = null,
    layer = null,
    element = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element;
        initialPage(form);
    });

});

function saveConfirm(){
    var id = $("#id").val();
    var checkDesc = $("#checkDesc").val();
    var realCost = $("#realCost").val();
    //TODO 校验
    var params = {'productId': id, 'checkDesc': checkDesc, 'realCost': realCost};
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/product/check",
        type: "post",
        data: params,
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                x_admin_close();
                parent.initPage(1, resultData.returnMessage);
            } else {
                layer.msg(resultData.data, {icon: 5, time:3000});
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
function initialPage(form) {
    var page_type = getUrlParam('type');
    var title = '添加';
    if(page_type && page_type == 1) {
        title = '编辑';
        displayProduct(getUrlParam('productId'), form);
    }else {
        $("#id").val('0');
    }
    $('#submitBtn').text(title);
}
/**
 * 编辑前回显
 * @param id
 */
function displayProduct(id, form) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/product/find?productId=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var product = resultData.data;
                $("#id").val(product.id);
                $("#productId").val(product.productId);
                $("#contractTime").val(product.contractTime);
                $("#name").val(product.name);
                $("#contactName").val(product.realName);
                $("#budget").val(product.budget);
                $("#phone").val(product.phone);
                $("#period").val(product.period);
                $("#expectDeliveryTime").val(product.expectDeliveryTime);
                $("#realDeliveryTime").val(product.realDeliveryTime);
                $("#deliveryDesc").val(product.deliveryDesc);
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
