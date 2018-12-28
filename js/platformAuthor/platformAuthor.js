var token = localStorage.getItem('OperaAuthorization');
var tokenString = 'Bearer ' + token;
var form = null,layer = null,element = null;
$(document).ready(function (){
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        var userId = getUrlParam("id");
        editMenu(userId);
    });
});

//页面参数传递
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


// 添加菜单
function editMenu(id) {
    var loadingIndex = layer.load(1);
    var id = id;
    var defaultImageDate = "";
    $("#expandIds").val(id);
    $.ajax({
        url: baseUrl + "/auditing/findById?id=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                expand = resultData.data;
                $("#corpId").val(expand.corpId);
                $("#orgNo").val(expand.orgNo);
                $("#authFile").val(expand.authFile);
                $("#corpName").val(expand.corpName);
                $("#applyName").val(expand.phone);
                $("#orgName").val(expand.orgName);
                $("#authorType").val('征信报告授权');
                $("#authorCorp").val(expand.corpName);
                if (expand.fileData != null) {
                    $("#authorBook").attr("src","data:image/png;base64,"+expand.fileData);
                }else{
                    $("#authorBook").attr("src","data:image/png;base64,"+defaultImageDate);
                }
            }else{
                //alert("请求错误");
                layer.msg("请求错误",{icon:1,time:2000});
            }
        },complete: function () {
        layer.close(loadingIndex);
    }
    });
}


function submitExpand() {
    var flag = $("input[name='radio']:checked").val();
    if (flag == '1') {
        saveExpand();
    } else {
        changeExpandFailure();
    }
}

function changeExpandFailure() {
    var loadingIndex = layer.load(1);
    var expandIds = $("#expandIds").val();
    var remark = $("#remark").val();
    $.ajax({
        url: baseUrl + "/auditing/changeExpandStatus?expandId="+expandIds+"&remark="+remark+"",
        type: "get",
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                x_admin_close();
                parent.initPage(1, resultData.returnMessage);
            } else {
                //alert(resultData.returnMessage);
                layer.msg(resultData.returnMessage,{icon:1,time:2000});
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });
}

//保存授权
function saveExpand() {
    var loadingIndex = layer.load(1);
    var expandIds = $("#expandIds").val();
    var corpId = $("#corpId").val();
    var orgNo = $("#orgNo").val();
    var authFile = $("#authFile").val();
    var remark = $("#remark").val();
    var corpName = $("#corpName").val();
    if(corpId.length < 1){
        //alert("corpId不能为空");
        layer.msg("corpId不能为空",{icon:1,time:2000});
        return;
    }
    if(orgNo.length < 1){
        //alert("orgNo不能为空");
        layer.msg("orgNo不能为空",{icon:1,time:2000});
        return;
    }
    if (corpName.length < 1) {
        //alert("corpId不能为空");
        layer.msg("corpId不能为空",{icon:1,time:2000});
        return;
    }
    var v1 = ["digitFile",authFile,getNextYeary()];
    var v2 = ["collectFile",authFile,getNextYeary()];
    var params = {corpId: corpId, orgNo: orgNo,expandId:expandIds,corpName:corpName,remark:remark, files: [v1,v2]};
    $.ajax({
        url: baseUrl + "/auditing/saveAudting",
        type: "post",
        contentType: "application/json;charset=UTF-8",
        crossDomain: true == !(document.all),
        data: JSON.stringify(params),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                x_admin_close();
                parent.initPage(1, resultData.returnMessage);
            } else {
                layer.msg(resultData.returnMessage, {icon: 5, time:3000});
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });
}

//获取明年的时间，格式为yyyyy-mm-dd
function getNextYeary() {
    var date = new Date();
    date.setFullYear(date.getFullYear()+1);
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

