var userId;

layui.use(['form', 'layer', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element;

    userId = getUrlParam("id");
    getDevInfo(userId);
    initApiTree();
    initOrgTree();
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

/**
 * 初始化开发者信息
 * @param registerId
 */
function getDevInfo(registerId) {
    var param = {};
    param["registerId"] = registerId;
    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl +"/fipOperaApi/operation/register/info",
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
                $('#auditPhone').val(content.phone);
                $('#auditOrgName').val(content.orgName);
                $('#auditEmail').val(content.email);
            }
        },
    });
}

/***
 * 提交审核信息
 */
function devAuditSubmit() {
    //审核
    var auditResult = $(":radio[name='auditType']:checked").val();
    if(auditResult == undefined  || auditResult.length == 0){
        layer.msg("请选择处理结果",{icon:5,time:1000});
        return;
    }
    if(auditResult == 1){
        //是否选择所属机构
        var orgNo = $("#orgNo").val();
        if(orgNo.length == 0){
            layer.msg("请选择关联机构",{icon:5,time:1000});
            return;
        }
        var arr = $.fn.zTree.getZTreeObj("apiTree").getCheckedNodes();
        if(arr.length == 0){
            layer.msg("请选择api权限",{icon:5,time:1000});
            return;
        }
        var apiStr = new Array();
        var j=0;
        for (var key in arr) {
            if(arr[key].nodes == null){
                apiStr[j] = arr[key].id;
                j++;
            }
        }
        var param = {};
        param["registerId"] = userId;
        param["orgNo"] = orgNo;
        param["orgName"] = $('#simpleOrgName').val();
        param["api"] = apiStr;
        //param["auditor"] = "admin";
        var loadingIndex = layer.load(1);
        $.ajax({
            data: JSON.stringify(param),
            url: baseUrl +"/open/register/audit/pass",
            type: "post",
            contentType: "application/json;charset=utf-8",
            crossDomain: true == !(document.all),
            beforeSend: function(request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if(resultData.returnCode == 200){
                    layer.msg(resultData.returnMessage, {icon: 6});
                    var index = parent.layer.getFrameIndex(window.name);
                    //关闭当前frame
                    parent.layer.close(index);
                    //刷新列表
                    parent.getDevAudit();
                }else {
                    layer.msg("审核失败：" + resultData.returnMessage,{icon:5,time:1000});
                }
            },complete: function () {
                layer.close(loadingIndex);
            }
        });
    }
    if(auditResult == 2){
        //参数校验
        var auditComments = $('#auditComments').val();
        if(auditComments.length == 0){
            layer.msg("请输入处理意见",{icon:5,time:1000});
            return;
        }
        var param = {};
        param["registerId"] = userId;
        //param["auditor"] = "admin";
        param["auditInfo"] = auditComments;
        var loadingIndex = layer.load(1);
        $.ajax({
            data: JSON.stringify(param),
            url: baseUrl +"/open/register/audit/refuse",
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
                    parent.getDevAudit();
                }else {
                    layer.msg("审核失败：" + resultData.returnMessage,{icon:5,time:1000});
                }
            },complete: function () {
                layer.close(loadingIndex);
            }
        });
    }
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
