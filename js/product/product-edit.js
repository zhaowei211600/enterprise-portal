var form = null,
    layer = null,
    element = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element;
        initialPage(form);

        form.on('submit(product)', function(data){
            var id = $("#id").val();
            var budget = $("#budget").val();
            var productName = $("#productName").val();
            var expectDeliveryTime = $("#expectDeliveryTime").val();
            var period = $("#period").val();
            var desc = $("#desc").val();
            var params = {'id': id, 'name': productName, 'budget': budget, 'expectDeliveryTime': expectDeliveryTime, 'period': period, 'desc':desc};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/product/save",
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
        url: baseUrl + "/operation/product/findById?id=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var menu = resultData.data;
                $("#id").val(menu.id);
                $("#name").val(menu.name);
                $("#url").val(menu.url);
                $("#order").val(menu.order);
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
