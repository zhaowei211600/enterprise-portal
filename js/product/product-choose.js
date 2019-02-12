var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        form.on('submit(sreach)', function (data) {
            productList(null);
        });
        $("#searchBtn").click();
    });
});

/**
 * 列表方法
 * @param cur_page
 */
function productList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['productName'] = $('#productName').val();
    param['realName'] = $('#realName').val();
    param['phone'] = $("#phone").val();
    param['doingProduct'] = $("#doingProduct").val();
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/product/list/choose",
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    var list = resultData.data;
                    total = resultData.total;
                    var tbody = '';
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.name + "</td>";
                        tbody += "<td>" + content.budget + "</td>";
                        tbody += "<td>" + content.expectCost + "</td>";
                        tbody += "<td>" + content.period + "</td>";
                        tbody += "<td>" + content.expectDeliveryTime + "</td>";
                        tbody += "<td>" + content.realName + "</td>";
                        tbody += "<td>" + content.phone + "</td>";
                        tbody += "<td>" + content.doingProduct + "</td>";
                        tbody += "<td class=\"td-manage\">" ;
                        tbody += "<a title=\"确认接单\" onclick=\"chooseUser("+content.orderId+","+content.id+","+content.userId+")\" href=\"javascript:;\">\n" +
                            "                    <i class=\"layui-icon\">&#xe672;</i>\n" +
                            "                </a></td>";
                        tbody += "</tr>";
                    }
                    $('#productList').html(tbody);
                }
            }else {
                $('#productList').html("");
            }
            paging('productPageDiv', total, cur_page, 'totalNum', 'productList');
            return false;
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

/**
 * 编辑页回调主页面-入口方法
 * @param icon(图标类型)
 * @param msg(信息)
 */
function initPage(icon, msg) {
    layer.msg(msg,{icon:icon,time:2000});
    productList(null);
}

function chooseUser(orderId, productId, userId) {
    var param = {};
    layer.confirm('确认选择此接单人？', {skin: 'layui-layer-molv'}, function(index){
        param["productId"] = productId;
        param["userId"] = userId;
        param["orderId"] = orderId;

        $.ajax({
            data:param,
            url: baseUrl + "/operation/product/choose",
            type: "post",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    layer.msg('设置成功!',{icon:1,time:1000});
                    productList(null);
                    x_admin_close();
                }else {
                    layer.msg(resultData.returnMessage,{icon:2,time:1000});
                }
            }
        });
    });
}
