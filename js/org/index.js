var zTree;

var setting = {
    view: {
        dblClickExpand: false,
        showLine: true,
        selectedMulti: false,
        fontCss:{font:"12px"}
    },
    data: {
        key: {
            children: "children",
            name: "name"
        },
        simpleData: {
            enable:true,
            idKey:"orgNo",
            pIdKey: "parentOrgNo"
        }
    },callback:{
        onClick:orgTreeClick,
    }
};

/**
 * 机构树点击事件
 */
function orgTreeClick(e, treeId, treeNode) {
    zTree = $.fn.zTree.getZTreeObj("orgTree");
    if(zTree != null && zTree != 'undefined'){
        nodes = zTree.getSelectedNodes();
        if(nodes != '' && nodes.length > 0){
            var html = "<ul><li>机构编号:"+nodes[0].orgNo+"</li><li>机构名称:"+nodes[0].name+"</li></ul>";
            layer.tips(html, "#"+nodes[0].tId+"_span",{
                area: ['auto', 'auto']//这个属性可以设置宽高  auto 表示自动
            });
        }
    }

}



layui.use(['form', 'layer', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element;

    initOrgTree();
});

/**
 * 初始化机构树
 */
function initOrgTree() {

    $.ajax({
        type: "post",
        url: baseUrl + "/fipOperaOrg/org/tree",
        data:{"parentOrgNo":"0"},
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success: function (data) {
            if(data.returnCode == '200'){
                //生成机构树
                $.fn.zTree.init($("#orgTree"), setting, data.data);
            }
        }
    });
}

function addOrg() {
    var arr = $.fn.zTree.getZTreeObj("orgTree").getSelectedNodes();
    if(arr.length == 0){
        layer.msg("未选择一级机构，将创建一级菜单",{icon:1,time:1000});
        x_admin_show("新增机构","../../html/org/org-add.html?orgNo=",600,500);
    }else{
        x_admin_show("新增机构","../../html/org/org-add.html?orgNo="+arr[0].orgNo,600,500);
    }
}

function editOrg() {
    var arr = $.fn.zTree.getZTreeObj("orgTree").getSelectedNodes();
    if(arr.length == 0){
        layer.msg("请选择机构",{icon:2,time:1000});
        return;
    }else{
        x_admin_show("修改机构","../../html/org/org-edit.html?orgNo="+arr[0].orgNo,600,500);
    }
}