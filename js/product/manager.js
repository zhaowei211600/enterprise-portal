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
    param['status'] = $('#status').val();
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
                        if(content.status == '1'){
                            status = '待接单';
                        }else if(content.status == '2'){
                            status = '进行中';
                        }else if(content.status == '3'){
                            status = '待验收';
                        }else if(content.status == '4'){
                            status = '已验收';
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.name + "</td>";
                        tbody += "<td>" + content.desc + "</td>";
                        tbody += "<td>" + status + "</td>";
                        if(content.status != '1'){
                            tbody += "<td> -- </td>";
                        }else{
                            tbody += "<td class=\"td-manage\">" ;
                            tbody += "<a  onclick=\"x_admin_show('设置接单人','./choose-backup.html?productId="+content.id+"&attr="+content.attr+"',800,600)\" href=\"javascript:;\">" +
                                "                    设置接单人" +
                                "                </a></td>";
                        }
                        tbody += "<td class=\"td-manage\">" ;
                       /* tbody += "<a title=\"待启动\" onclick=\"changeStatus("+content.id+","+content.status+",'1')\" href=\"javascript:;\">\n" +
                            "                    <i class=\"layui-icon\">待启动</i>\n" +
                            "                </a>";*/
                        tbody += "<a  onclick=\"changeStatus("+content.id+","+content.status+",'2')\" href=\"javascript:;\">" +
                            "                    进行中 " +
                            "                </a>";
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

function changeStatus(id, currentStatus, changeStatus) {
    if(currentStatus == 4){
        layer.msg('项目已结项，无法修改!',{icon:2,time:1000});
        return false;
    }
    if(changeStatus == '2'){
        if(currentStatus == '1' || currentStatus == '2'){
            x_admin_show('设置接单人','./choose.html?productId='+id+'&type=1',800,600);
            return false;
        }else{
            layer.msg('项目当前状态无法重新设置接单人!',{icon:2,time:1000});
            return false;
        }
    }else if(changeStatus == '3'){
        if(currentStatus == '2'){
            layer.confirm('确认要提交验收吗？', {skin: 'layui-layer-molv'}, function(index){
                $.ajax({
                    url: baseUrl + "/operation/product/apply?productId=" + id,
                    type: "post",
                    crossDomain: true == !(document.all),
                    beforeSend: function (request) {
                        request.setRequestHeader("OperaAuthorization", TOKEN);
                    },
                    success: function (resultData) {
                        if (resultData.returnCode == 200) {
                            layer.msg('提交成功，请等待审核!',{icon:1,time:1000});
                            productList(null);
                        }else {
                            layer.msg(resultData.returnMessage,{icon:2,time:1000});
                        }
                        return false;
                    }
                });
            });
        }else {
            layer.msg('项目当前状态无法提交验收!',{icon:2,time:1000});
            return false;
        }
    }else{
        if(changeStatus == '4'){
            if(currentStatus == '3'){
                var params = {'productId': id,};
                layer.confirm('确认要结项该项目吗？', {skin: 'layui-layer-molv'}, function(index){
                    $.ajax({
                        url: baseUrl + "/operation/product/check",
                        type: "post",
                        data: params,
                        beforeSend: function (request) {
                            request.setRequestHeader("OperaAuthorization", TOKEN);
                        },
                        success: function (resultData) {
                            if (resultData.returnCode == 200) {
                                initPage(1, "验收成功！");
                            } else {
                                layer.msg(resultData.data, {icon: 5, time:3000});
                            }
                        }
                    });
                });
            }else{
                layer.msg('项目当前状态无法结项!',{icon:2,time:1000});
            }
        }
    }

}
