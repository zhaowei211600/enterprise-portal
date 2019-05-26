var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        statProduct();
        form.on('submit(sreach)', function (data) {
            statList(null);
        });
        $("#searchBtn").click();
    });
});

var total = 0;
/**
 * 列表方法
 * @param cur_page
 */
function statList(cur_page) {
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['publishTimeStart'] = $("#startDate").val();
    param['publishTimeEnd'] = $("#endDate").val();
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/product/list/publish",
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
                        var status = '';
                        var contractTime = '--';
                        var realDeliveryTime = '--';
                        if(content.status == '1'){
                            status = '待接单';
                        }else if(content.status == '2'){
                            status = '进行中';
                        }else if(content.status == '3'){
                            status = '已结束';
                        }
                        if(content.contractTime != 'null' && content.contractTime != null){
                            contractTime = content.contractTime;
                        }
                        if(content.realDeliveryTime != 'null' && content.realDeliveryTime != null){
                            realDeliveryTime = content.realDeliveryTime;
                        }
                        var periodEnd = '';
                        if(content.periodEnd != null && content.periodEnd != ''){
                            periodEnd = content.periodEnd;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.name + "</td>";
                        tbody += "<td>" + content.budget + "</td>";
                        tbody += "<td>" + content.periodStart + "</td>";
                        tbody += "<td>" + periodEnd + "</td>";
                        tbody += "<td>" + content.expectDeliveryTime + "</td>";
                        tbody += "<td>" + status + "</td>";
                        tbody += "<td>" + content.settleAmount + "</td>";
                        tbody += "<td class='td-manage' >" +
                            "<a onclick=\"x_admin_show('接单详情','./stat-detail.html?productId="+content.id+"',1000,600)\" href=\"javascript:;\">接单详情</a>" +
                            "</td>" ;
                        tbody += "</tr>";
                    }
                    $('#statList').html(tbody);
                }
            } else {
                $('#statList').html("");
            }
            paging('statPageDiv', total, cur_page, 'totalNum', 'statList');
            return false;
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

function statProduct() {
    $.ajax({
        url: baseUrl + "/operation/product/stat",
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    $("#totalCount").html(resultData.data.totalCount);
                    $("#doingCount").html(resultData.data.doingCount);
                    $("#finishCount").html(resultData.data.finishCount);
                    $("#settleAmount").html(resultData.data.settleAmount)
                }
            }
            return false;
        },
        complete: function () {
        }
    });
}

/**
 * 编辑页回调主页面-入口方法
 * @param icon(图标类型)
 * @param msg(信息)
 */
/*function initPage(icon, msg) {
    layer.msg(msg,{icon:icon,time:2000});
    statList(null)
    statProduct();
}*/
