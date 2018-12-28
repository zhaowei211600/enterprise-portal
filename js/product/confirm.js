var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        form.on('submit(sreach)', function (data) {
            productConfirmList(null);
        });
        $("#searchBtn").click();
    });
});

var total = 0;
/**
 * 列表方法
 * @param cur_page
 */
function productConfirmList(cur_page) {
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['productName'] = $('#productName').val();
    param['status'] = $('#status').val();
    param['deliveryTimeStart'] = $("#startDate").val();
    param['deliveryTimeEnd'] = $("#endDate").val();
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/product/list/check",
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    var list = resultData.data;
                    total = resultData.data.total;
                    var tbody = '';
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        var status = '';
                        var publishStatus = '';
                        if(content.status == '1'){
                            status = '待接单';
                        }else if(content.status == '2'){
                            status = '进行中';
                        }else if(content.status == '3'){
                            status = '待验收';
                        }else if(content.status == '4'){
                            status = '已验收';
                        }

                        if(content.publishStatus == '0'){
                            publishStatus = '未发布';
                        }else if(content.publishStatus == '1'){
                            publishStatus = '已发布';
                        }else if(content.publishStatus == ''){
                            publishStatus = '已下架';
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.name + "</td>";
                        tbody += "<td>" + content.budget + "</td>";
                        tbody += "<td>" + content.period + "</td>";
                        tbody += "<td>" + content.expectDeliveryTime + "</td>";
                        tbody += "<td>" + content.realDeliveryTime + "</td>";
                        tbody += "<td>" + status + "</td>";
                        tbody += "<td class=\"td-manage\">" +
                            "<a title=\"编辑\"  onclick=\"x_admin_show('项目发布','./product-edit.html?productId="+content.id+"&type=1',800,600)\" href=\"javascript:;\">\n" +
                            "<i class=\"layui-icon\">&#xe642;</i></a>";
                        tbody += "</tr>";
                    }
                    $('#productList').html(tbody);
                }
            } else {
                $('#productList').html("");
            }
            paging('productPageDiv', total, cur_page, 'totalNum', 'productConfirmList');
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
    productConfirmList(null);
}
