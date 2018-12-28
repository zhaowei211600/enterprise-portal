layui.use(['form', 'layer', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element;

    var userId = getUrlParam("id");
    showUserDetail(userId);
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
 * 获取父页面URL形式的传参
 * @param name
 * @returns {*}
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
