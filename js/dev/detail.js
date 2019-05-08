var userId;

layui.use(['form', 'layer', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element;

    userId = getUrlParam("id");
    if(userId != ''){
        getDevManageInfo();
        getDevContact();
        initApiTree();
        initOrgTree();
    }
});


/**
 * 机构树点击事件
 */
function orgTreeOnClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("orgTree");
    nodes = zTree.getSelectedNodes();
    $("#simpleOrgName").val(nodes[0].name);
    $("#orgNo").val(nodes[0].orgNo);
}

/**
 * 初始化机构树
 */
function initOrgTree() {
    var zTree;

    var setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
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
        },
        callback: {
            onClick: orgTreeOnClick
        }
    };

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


function initApiTree() {
    var zTree;
    var apiTreeSetting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: true
        },
        check: {
            enable: true
        },
        data: {
            key: {
                children: "nodes",
                name: "text"
            },
            simpleData: {
                enable:true,
                idKey:"id",
                pIdKey: "parentId"
            }
        }
    };
    $.ajax({
        url: baseUrl +"/fipOperaApi/operation/api/info",
        type: "get",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                $.fn.zTree.init($("#apiTree"), apiTreeSetting, resultData.data);

                var apiTreeObj = $.fn.zTree.getZTreeObj("apiTree");
                var nodes = apiTreeObj.getNodes();
                for (var i = 0; i < nodes.length; i++) { //设置节点展开
                    apiTreeObj.expandNode(nodes[i], true, false, true);
                }
            }
            getApiInfo();
        },
    });
}

/**
 * 显示机构树
 */
function showOrgTree(){
    var deptObj = $("#simpleOrgName");
    $("#orgContent").css({background:"white"}).slideDown("fast");
    $('#orgTree').css({width:deptObj.outerWidth() - 12 + "px",height:"300px"});
    $("body").bind("mousedown", onBodyDownByOrgTree);
}


/**
 * Body鼠标按下事件回调函数
 */
function onBodyDownByOrgTree(event) {
    if(event.target.id.indexOf('switch') == -1){
        hideOrgTree();
    }
}
/**
 * 隐藏机构树
 */
function hideOrgTree() {
    $("#orgContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDownByOrgTree);
}


function getDevManageInfo() {
    var param = {};
    param["devId"] = userId;
    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl +"/fipOperaApi/operation/dev/info",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                var list = resultData.data.list || {};
                var content = list[0];
                $('#auditOrgName').val(content.orgName);
                $('#devUserName').val(content.userName);
                $('#appKey').val(content.appKey);
                $('#appSecret').val(content.appSecret);
                $('#simpleOrgName').val(content.orgName);
                $('#orgNo').val(content.orgNo);
            }
        },
    });



}

function getDevContact() {
    $.ajax({
        url: baseUrl +"/fipOperaApi/operation/contact/info?devId=" + userId,
        type: "get",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            console.log(resultData);
            if(resultData.returnCode == 200){
                var list = resultData.data || {};
                $("#auditPhone").val(list[0].phone);
                $("#auditEmail").val(list[0].email);
            }
        },
    });
}

function getApiInfo() {
    //获取当前权限
    $.ajax({
        url: baseUrl +"/fipOperaApi/operation/dev/api?devId=" + userId,
        type: "get",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                console.log(resultData)
                var treeNode =resultData.data;
                if (treeNode != null) {
                    //获取ztree对象
                    var treeObj = $.fn.zTree.getZTreeObj("apiTree");
                    //遍历勾选角色关联的菜单数据
                    for (var i = 0; i < treeNode.length; i++) {
                        //根据角色菜单节点数据的属性搜索，获取与完整菜单树完全匹配的节点JSON对象集合
                        var nodes = treeObj.getNodesByParam("text",treeNode[i], null);
                        //勾选当前选中的节点
                        treeObj.checkNode(nodes[0], true, true);
                    }
                }
            }
        }
    });
}

function devManageSubmit() {
    //参数校验
    if($('#simpleOrgName').val().length == 0){
        layer.msg("请选择所属机构",{icon:5,time:1000});
        return;
    }
    var arr = $.fn.zTree.getZTreeObj("apiTree").getCheckedNodes();
    var apiStr = new Array();
    var j=0;
    for (var key in arr) {
        if(arr[key].nodes == null){
            apiStr[j] = arr[key].id;
            j++;
        }
    }
    var param = {};
    param["devId"] = userId;
    param["orgNo"] = $('#orgNo').val();
    param["orgName"] = $('#simpleOrgName').val();
    if(apiStr.length > 0){
        param["api"] = apiStr;
    }
    var loadingIndex = layer.load(1);
    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl +"/fipOperaApi/operation/dev/manage/update",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                layer.msg(resultData.returnMessage, {icon: 6}, function () {
                    // 获得frame索引
                    var index = parent.layer.getFrameIndex(window.name);
                    //关闭当前frame
                    parent.layer.close(index);
                });
                //刷新列表
                parent.getDevManage();
            }else {
                layer.msg("更新失败：" + resultData.returnMessage,{icon:5,time:1000});
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });
}
/**
 * 获取父页面URL形式的传参
 * @param name
 * @returns {*}
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
