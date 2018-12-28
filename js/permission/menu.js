var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        form.on('submit(sreach)', function (data) {
            menuList(null);
        });
        $("#searchBtn").click();
    });
});

/**
 * 列表方法
 * @param cur_page
 */
function menuList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['name'] = $('#queryName').val();
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/menu/list",
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    var list = resultData.data.list;
                    total = resultData.total;
                    var tbody = '';
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        tbody += "<tr>";
                        tbody += "<td>" + content.name + "</td>";
                        tbody += "<td class=\"td-manage\">" +
                            "<a title=\"编辑\"  onclick=\"x_admin_show('编辑菜单','./menu-operation.html?menuId="+content.id+"&type=1',600,400)\" href=\"javascript:;\">\n" +
                            "<i class=\"layui-icon\">&#xe642;</i></a>";
                        tbody += "<a title=\"删除\" onclick=\"deleteMenu("+content.id+")\" href=\"javascript:;\">\n" +
                            "                    <i class=\"layui-icon\">&#xe640;</i>\n" +
                            "                </a></td>";
                        tbody += "</tr>";
                    }
                    $('#menuList').html(tbody);
                }
            }else {
                $('#menuList').html("");
            }
            paging('menuPageDiv', total, cur_page, 'totalNum', 'menuList');
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
    menuList(null);
}

/**
 * 删除角色
 * @param id
 */
function deleteMenu(id) {
    layer.confirm('确认要删除吗？', {skin: 'layui-layer-molv'}, function(index){
        $.ajax({
            url: baseUrl + "/menu/delete?id=" + id,
            type: "post",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    layer.msg('删除成功!',{icon:1,time:1000});
                    menuList(null);
                } else {
                    layer.msg(resultData.returnMessage,{icon:1,time:1000});
                }
            }
        });
    });
}