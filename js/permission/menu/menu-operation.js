var form = null,
    layer = null,
    element = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element;
        initialPage(form);
        //自定义验证规则
        form.verify({
            name: [/([\u4E00-\u9FA5]{1,10} )||([A-Za-z0-9 ]{1,20})/, '名称不符合长度限制']
        });

        //监听提交
        form.on('submit(operation)', function (data) {
            var id = $("#id").val();
            var url = $("#url").val();
            var name = $("#name").val();
            var parentId = $("#parentId").val();
            var order = $("#order").val();
            var params = {id: id, name: name, url: url, parentId: parentId, order: order};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/menu/save",
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
            return false;
        });
    });

});

function initialPage(form) {
    var page_type = getUrlParam('type');
    var title = '添加';
    if(page_type && page_type == 1) {
        title = '编辑';
        displayMenu(getUrlParam('menuId'), form);
    }else {
        $("#id").val('0');
        getParentNode(form, null);
    }
    $('#submitBtn').text(title);
}
/**
 * 编辑前回显
 * @param id
 */
function displayMenu(id, form) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/menu/findById?id=" + id,
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
                getParentNode(form, menu.parentId);
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

function getParentNode(form, parent_node_id) {
    $.ajax({
        url: baseUrl + "/menu/getAllMenus",
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                var tbody = "<option value=\"0\">顶级节点</option>";
                if(parent_node_id && null != parent_node_id){
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        if (parent_node_id == content.id) {
                            tbody += "<option selected value=" + content.id + ">" + content.text + "</option>option>";
                        } else {
                            tbody += "<option value=" + content.id + ">" + content.text + "</option>option>";
                        }
                    }
                }else {
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        tbody += "<option value=" + content.id + ">" + content.text + "</option>option>";
                    }
                }
                $('#parentId').html(tbody);
                form.render('select');
            }
        },
    });
}