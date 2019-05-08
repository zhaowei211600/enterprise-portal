var form = null,
    layer = null,
    element = null;
var productId, status;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element;
        initialPage(form);

        form.on('submit(product)', function(data){
            var id = $("#id").val();
            var checkDesc = $("#checkDesc").val();
            var realCost = $("#realCost").val();
            var params = {'productId': id, 'checkDesc': checkDesc, 'realCost': realCost};
            if(status == '4'){
                layer.msg("当前项目已结项", {icon: 5, time:3000});
            }
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
        });
    });

});

function initialPage(form) {
    productId = getUrlParam('productId');
    if(productId != 0) {
        displayProduct(productId , form);
    }else {
        $("#id").val('0');
    }
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
                status = product.status;
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
                if(status == '4'){
                    $("#checkDesc").val(product.checkDesc);
                    $("#checkDesc").attr("disabled", "disabled");
                    $("#realCost").val(product.realCost);
                    $("#realCost").attr("disabled", "disabled");
                    $("#saveProductBtn").attr("disabled", "disabled");
                }
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
