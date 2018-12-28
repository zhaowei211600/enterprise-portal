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

/**
 * 机构树点击事件
 */
function orgTreeOnClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("orgTree");
    nodes = zTree.getSelectedNodes();
    console.log(JSON.stringify(nodes));
    $("#simpleOrgName").val(nodes[0].name);
    $("#orgNo").val(nodes[0].orgNo);
}


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

layui.use(['form', 'layer', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element;

    var userId = getUrlParam("id");
    showUserDetail(userId);
    initOrgTree();
});

/**
 * 根据userId获取用户信息
 * 弹出用户审核详情或者用户审核界面
 */
function showUserDetail(userId) {
    if(userId != ''){
        $.ajax({
            type: "post",
            url: baseUrl + "/fipOperaOrg/orgUser/audit/info",
            data:{"userId":userId},
            async: false,
            crossDomain: true == !(document.all),
            beforeSend: function(request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);},
            success: function (data) {
                console.log(data.data);
                if(data.returnCode == '200'){
                    var user = data.data;
                    var auditState = user.auditState ;
                    $("#userId").val(user.userId);
                    $("#orgUserName").val(user.name);
                    $("#userEmail").val(user.email);
                    $("#userPhone").val(user.phone);
                    $("#simpleOrgName").val(user.orgName);
                    $("#orgNo").val(user.orgNo);
                    $("#auditComments").val(user.auditComments);
                    if(user.cardBase64 != ''){
                        $("#card").attr("src","data:image/png;base64," + user.cardBase64);
                    }
                    //审核和驳回
                    if(3 == auditState){

                    }else if(4 == auditState || 5 == auditState){
                        /*$('[name=auditType]').each(function(i,item){
                            if($(item).val()== auditState){
                                $(item).prop('checked',true);
                                layui.use('form',function(){
                                    var form = layui.form;
                                    form.render();
                                });
                            }
                        });*/
                        $(":radio[name='auditType'][value='" + auditState + "']").prop("checked", true);
                        $(":radio[name='auditType']").attr("disabled","disabled");
                        $("#auditComments").attr("readonly","readonly");
                        $("#simpleOrgName").attr("disabled","disabled");
                        $("#saveButton").attr("disabled","disabled").addClass("layui-btn-disabled");
                        layui.use('form',function(){
                            var form = layui.form;
                            form.render();
                        });
                    }
                }
            }
        });
    }
}

/**
 * 保存审核
 */
function saveAudit() {
    var id = $("#userId").val();
    var orgNo = $('#orgNo').val();
    var state = $(":radio[name='auditType']:checked").val();
    var auditComments = $('#auditComments').val();
    if($('#simpleOrgName').attr("readonly")=='readonly') {
        layer.msg("该机构已被审核，无需重复操作",{icon:5,time:1000});
        return;
    }

    if(state != "5" && (orgNo==null||orgNo==undefined||orgNo=="")) {
        layer.msg("所属机构不能为空",{icon:5,time:1000});
        return;
    }
    if(state==null||state==undefined||state=="") {
        layer.msg("处理结果必须要选",{icon:5,time:1000});
        return;
    }
    if(state=="5" && (auditComments==null||auditComments==undefined||auditComments=="")){
        layer.msg("处理意见必须填写",{icon:5,time:1000});
        return;
    }

    var param = {};
    param["id"] = id;
    param["orgNo"] = orgNo;
    param["state"] = state;
    param["auditComments"] = auditComments;
    $.ajax({
        type: "post",
        url: baseUrl + "/orgUser/audit/save",
        data:JSON.stringify(param),
        dataType:"json",
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
            request.setRequestHeader("Content-type","application/json;charset=utf-8");
        },
        success: function (data) {
            if(data.returnCode == '200'){
                layer.msg(data.returnMessage, {icon: 6}, function () {
                    x_admin_close();
                });
                //刷新列表
                parent.getOrgUserList();
            }else{
                layer.msg("保存失败",{icon:5,time:1000});
            }
        },error:function () {
            layer.msg("保存失败",{icon:5,time:1000});
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
