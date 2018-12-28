var form = null,
    layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        initialPage(form);
        //自定义验证规则
        form.verify({
            name: function (value) {
                if (value.length < 1 || value.length > 20) {
                    return '名称必须为20个以内的字符';
                }
            }
        });
        //监听提交
        form.on('submit(operation)', function (data) {
            var id = $("#id").val();
            var name = $("#name").val();
            var arr = $('#apiTree').treeview('getChecked');
            if (!arr || arr.length == 0) {
                layer.msg('请选择api权限', {icon: 5, time: 3000});
                return false;
            }
            var apiStr = new Array();
            for (var key in arr) {
                apiStr.push(arr[key].id);
                var parentId = arr[key].parentId;
                if(null != parentId && typeof (parentId) !== 'undefined'){
                    var parentNode = $('#apiTree').treeview("getNode", parentId);
                    if(null != parentNode && typeof (parentNode) !== 'undefined' && 0 != parentNode.id && $.inArray(parentNode.id,apiStr) == -1) {
                        apiStr.push(parentNode.id);
                    }
                }
            }
            var params = {id: id, name: name,  menus: apiStr.join(",")};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/role/save",
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
                        layer.msg(resultData.data, {icon: 5, time: 3000});
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

/**
 * 以type参数判断【新增】/【编辑】
 * @param form
 */
function initialPage(form) {
    var page_type = getUrlParam('type');
    var title = '添加';
    if (page_type && page_type == 1) {
        title = '编辑';
        var id = getUrlParam('roleId');
        if (!id || '' == id) return;
        var loadingIndex = layer.load(1);
        displayRole(id, form, loadingIndex);
    } else {
        $("#id").val('0');
        var loadingIndex = layer.load(1);
        getApiInfo(null, loadingIndex);
    }
    $('#submitBtn').text(title);
}

/**
 * 编辑前回显
 * @param id
 */
function displayRole(id, form, loadingIndex) {
    $.ajax({
        url: baseUrl + "/operation/role/findById?id=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var role = resultData.data;
                $("#id").val(role.id);
                $("#name").val(role.name);
                $("#des").val(role.desc);
                $("#rank").val(role.rank);
                getApiInfo(id, loadingIndex);
            }
        }
    });
}

function getApiInfo(roleId, loadingIndex) {
    var path = "/operation/menu/all";
    var params = {roleId: roleId};
    $.ajax({
        url: baseUrl + path,
        type: "post",
        data: params,
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                $('#apiTree').treeview({
                    data: resultData.data,
                    showIcon: true,
                    showCheckbox: true,
                    color: "#009688",
                    //backColor: "black",背景色
                    //borderColor:'green',
                    collapseIcon: "glyphicon glyphicon-minus",//可收缩的节点图标
                    // nodeIcon: "glyphicon glyphicon-user",
                    // emptyIcon: "glyphicon glyphicon-ban-circle",//设置列表树中没有子节点的节点的图标
                    expandIcon: "glyphicon glyphicon-plus",  //设置列表上中有子节点的图标
                    highlightSearchResults:true,//是否高亮搜索结果 默认true
                    highlightSelected:true,     //是否选中高亮显示
                    onhoverColor: "#f5f5f5",    //鼠标滑过的颜色
                    levels: 1 ,                 //设置初始化展开几级菜单 默认为2
                    selectedIcon: 'glyphicon glyphicon-tint',
                     selectedBackColor: '#009688',  //设置被选中的节点背景颜色
                    //selectedColor : 'red',      //设置被选择节点的字体、图标颜色
                    showBorder:false,                //是否显示边框
                    // uncheckedIcon:'glyphicon glyphicon-unchecked',    //设置未选择节点的图标
                    showTags:true,//显示徽章
                });
                setParentChildRelate($('#apiTree'));
                $('#apiTree').treeview('expandAll', { silent: true });
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}