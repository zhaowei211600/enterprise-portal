var form = null,layer = null,element = null;
var productId;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;

        initPage();
    });
});

var total = 0;
/**
 * 列表方法
 * @param cur_page
 */
function statDetailList(cur_page) {
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['productId'] = productId;
    param['queryType'] = '1';
    var loadingIndex = layer.load(1);
    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl + "/operation/check/list",
        type: "post",
        crossDomain: true == !(document.all),
        contentType: 'application/json;charset=UTF-8',
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
                        if(content.status == '1'){
                            status = '待验收';
                        }else if(content.status == '2'){
                            status = '已验收';
                        }else if(content.status == '3'){
                            status = '验收拒绝';
                        }else if(content.status == '4'){
                            status = '已结算';
                        }


                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.updateTime + "</td>";
                        tbody += "<td>" + content.realName + "</td>";
                        tbody += "<td>" + content.phone + "</td>";
                        tbody += "<td>" + status + "</td>";
                        tbody += "<td>" + content.amount + "</td>";
                        tbody += "</tr>";
                    }
                    $('#statDetailList').html(tbody);
                }
            } else {
                $('#statDetailList').html("");
            }
            paging('statDetailPageDiv', total, cur_page, 'totalNum', 'statDetailList');
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
function initPage() {
    productId = getUrlParam("productId");
    statDetailList(null);
}
