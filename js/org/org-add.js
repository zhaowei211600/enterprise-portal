var orgNo;
layui.use(['form', 'layer', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element;

    orgNo = getUrlParam("orgNo");
    console.log(orgNo);
    if(orgNo != ''){
        queryOrgByNo(orgNo);
    }
    //监听提交
    form.on('submit(add)', function (data) {

        if ($.trim($("#simpleOrgName").val()) .length > 20) {
            layer.msg("机构简称不能超过20个字！",{icon:2,time:1000});
            $("#simpleOrgName").focus();
            return false;
        }
        if ($.trim($("#orgName").val()) .length > 100) {
            layer.msg("机构全称不能超过100个字！",{icon:2,time:1000});
            $("#orgName").focus();
            return false;
        }
        if ($.trim($("#orgAddress").val()) .length > 200) {
            layer.msg("地址不能超过200个字！",{icon:2,time:1000});
            $("#orgAddress").focus();
            return false;
        }

        var phone = $("#orgPhone").val();
        if(phone != ''){
            if (!$("#orgPhone").val().match(/^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
                layer.msg("手机号码格式不正确！",{icon:2,time:1000});
                $("#orgPhone").focus();
                return false;
            }
        }

        var param = {};
        var orgNo = $("#orgNo").val();
        param["orgNo"] = orgNo;
        param["simpleParentOrgName"] = $("#simpleParentOrgName").val();
        param["parentOrgNo"] = $("#parentOrgNo").val();
        param["simpleOrgName"] = $("#simpleOrgName").val();
        param["orgName"] = $("#orgName").val();
        param["orgAddress"] = $("#orgAddress").val();
        param["orgPhone"] = $("#orgPhone").val();
        $.ajax({
            type: "post",
            url: baseUrl + "/fipOperaOrg/org/save",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify(param),
            async: false,
            crossDomain: true == !(document.all),
            beforeSend: function(request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);},
            success: function (data) {
                if(data.returnCode == '200'){
                    layer.msg(data.returnMessage, {icon: 6,time:1000}, function () {
                        // 获得frame索引
                        var index = parent.layer.getFrameIndex(window.name);
                        //关闭当前frame
                        parent.layer.close(index);
                    });
                    parent.initOrgTree();
                }else{
                    layer.msg("更新失败",{icon:2,time:1000});
                }
            }
        });
    });

});
//根据机构编号获取机构信息
function queryOrgByNo(orgNo) {
    if(orgNo != null){
        $.ajax({
            type: "get",
            url: baseUrl + "/fipOperaOrg/org/find",
            data:{"orgNo":orgNo},
            async: false,
            crossDomain: true == !(document.all),
            beforeSend: function(request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);},
            success: function (data) {
                if(data.returnCode == '200'){
                    orgJson = data.data;
                    $("#parentOrgNo").val(orgJson.orgNo);
                    $("#simpleParentOrgName").val(orgJson.simpleOrgName);
                    //$("#orgName").val(orgJson.orgName);
                    //$("#orgNo").val(orgJson.orgNo);
                    //$("#simpleOrgName").val(orgJson.simpleOrgName);
                    //$("#orgAddress").val(orgJson.address);
                    //$("#orgPhone").val(orgJson.phone);
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
