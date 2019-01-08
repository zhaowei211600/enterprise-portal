var productId =  getUrlParam('productId');
var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        userList()
    });
});

/**
 * 列表方法
 * @param cur_page
 */
function userList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param["productId"] = productId;
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/order/product",
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
                        tbody += "<td>" + content.realName + "</td>";
                        tbody += "<td>" + content.phone + "</td>";
                        tbody += "<td>" + content.registerTime + "</td>";
                        tbody += "<td class=\"td-manage\">" ;
                        tbody += "<a title=\"选择接单人\" onclick=\"chooseUser("+content.id+","+content.userId+")\" href=\"javascript:;\">\n" +
                            "                    <i class=\"layui-icon\">&#xe672;</i>\n" +
                            "                </a></td>";
                        tbody += "</tr>";
                    }
                    $('#userList').html(tbody);
                }
            }else {
                $('#userList').html("");
            }
            paging('userPageDiv', total, cur_page, 'totalNum', 'userList');
            return false;
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

function chooseUser(orderId, userId) {
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
                    window.parent.productList(null);
                    x_admin_close();
                }else {
                    layer.msg(resultData.returnMessage,{icon:2,time:1000});
                }
            }
        });
    });
}
