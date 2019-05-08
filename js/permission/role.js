var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        roleList(null);
        form.on('submit(sreach)', function (data) {
            roleList(null);
        });
        $("#searchBtn").click();
    });
});

/**
 * 列表方法
 * @param cur_page
 */
function roleList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param["roleName"] = $("#queryName").val();
    param["updatorName"] = $("#queryOperator").val();
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/role/list",
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
                    if (list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            var content = list[i];
                            var menuName = '';
                            for(var j=0; j< content.menuList.length; j++){
                                if(j< content.menuList.length -1){
                                    menuName = menuName + content.menuList[j].name + ',';
                                }else{
                                    menuName = menuName + content.menuList[j].name;
                                }
                            }
                            tbody += "<tr>";
                            tbody += "<td>" + (i+1) + "</td>";
                            tbody += "<td>" + content.name + "</td>";
                            tbody += "<td>" + menuName + "</td>";
                            tbody += "<td class=\"td-manage\">" +
                                "<a title=\"编辑\"  onclick=\"x_admin_show('编辑角色','./role-operation.html?roleId="+content.id+"&type=1',800,600)\" href=\"javascript:;\">\n" +
                                "<i class=\"layui-icon\">&#xe642;</i></a>";
                            tbody += "<a title=\"删除\" onclick=\"deleteRole("+content.roleId+")\" href=\"javascript:;\">\n" +
                                "                    <i class=\"layui-icon\">&#xe640;</i>\n" +
                                "                </a></td>";
                            tbody += "</tr>";
                        }
                    }
                    $('#roleList').html(tbody);
                }
            }else {
                $('#roleList').html("");
            }
            paging('rolePageDiv', total, cur_page, 'totalNum', 'roleList');
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
    roleList(null);
}

/**
 * 删除角色
 * @param id
 */
function deleteRole(id) {
    layer.confirm('确认要删除吗？', {skin: 'layui-layer-molv'}, function(index){
        $.ajax({
            url: baseUrl + "/role/delete?roleId=" + id,
            type: "post",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    layer.msg('删除成功!',{icon:1,time:2000});
                    roleList(null);
                } else {
                    layer.msg(resultData.returnMessage,{icon:2,time:2000});
                }
            }
        });
    });
}

