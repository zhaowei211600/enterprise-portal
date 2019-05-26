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
    param['type'] = $('#type').val();
    param['attr'] = $("#attr").val();
    param['status'] = $("#status").val();
    param['queryType'] = '2';
    var loadingIndex = layer.load(1);
    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl + "/operation/check/list",
        type: "post",
        contentType: 'application/json;charset=UTF-8',
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
                        var status = '';
                        var type = '';
                        var attr = '';
                        if(content.status == '1'){
                            status = '待验收';
                        }else if(content.status == '2'){
                            status = '未结算';
                        }else if(content.status == '3'){
                            status = '验收拒绝';
                        }else if(content.status == '4'){
                            status = '已结算';
                        }

                        if(content.type == '1'){
                            type = '咨询培训类'
                        }else if(content.type == '2'){
                            type = '技术开发类'
                        }else if(content.type == '3'){
                            type = '中介服务类'
                        }else if(content.type == '4'){
                            type = '设计创意类'
                        }else if(content.type == '5'){
                            type = '其他'
                        }

                        if(content.attr == '1'){
                            attr = '持续性服务';
                        }else if(content.attr == '2'){
                            attr = '一次性服务';
                        }

                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.realName + "</td>";
                        tbody += "<td>" + content.phone + "</td>";
                        tbody += "<td>" + content.productName + "</td>";
                        tbody += "<td>" + content.budget + "</td>";
                        tbody += "<td>" + content.expectDeliveryTime + "</td>";
                        tbody += "<td>" + type + "</td>";
                        tbody += "<td>" + attr + "</td>";
                        tbody += "<td>" + status + "</td>";
                        tbody += "<td class=\"td-manage\">" +
                            "<a onclick=\"x_admin_show('项目验收 > 项目详情','./settle-detail.html?productId="+content.productId+"&type=1&orderId="+content.orderId+"',1000,600)\" href=\"javascript:;\">" +
                            "项目验收"+"</a>"
                        tbody += "|";
                        tbody += "<a onclick=\"closeProduct("+ content.productId +")\" href=\"javascript:;\">" +
                            "结束项目"+"</a></td>"
                        tbody += "</tr>";
                    }
                    $('#confirmList').html(tbody);
                }
            } else {
                $('#confirmList').html("");
            }
            paging('confirmPageDiv', total, cur_page, 'totalNum', 'productConfirmList');
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

function closeProduct(productId) {
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/product/close?productId="+ productId ,
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                productConfirmList(null);
            }else{
                layer.msg(resultData.returnMessage);
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}