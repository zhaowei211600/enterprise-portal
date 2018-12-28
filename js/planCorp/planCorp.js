var token = localStorage.getItem('OperaAuthorization');
var tokenString = 'Bearer ' + token;
var form = null,layer = null,element = null;
$(document).ready(function (){
    layui.use(['element','layer'], function(){
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        //数据回填
        var corpId = getUrlParam('corpId');
        var corpName = getUrlParam('corpName');
        detailPlanCorp(corpId,corpName);
    });

});

//页面参数传递
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}



function detailPlanCorp(corpId,corpName) {
    var loadingIndex = layer.load(1);
    if (!corpId || '' == corpId) {
        return;
    }
    if (!corpName || '' == corpName) {
        return;
    }
    $("#corpId").val(corpId);
    $("#corpName").val(decodeURI(corpName));
    layer.close(loadingIndex);
}

function auditMessage() {
    if ($.trim($("#corpAddTaxNo").val()) == '') {
        layer.msg("税号不能为空！",{icon:1,time:2000});
        return false;
    }
    if ($.trim($("#corpAddTaxNo").val()).length > 20
        || $.trim($("#corpAddTaxNo").val()).length < 15) {
        layer.msg("税号不正确！",{icon:1,time:2000});
        return false;
    }
    //var corpIdAdd = $(".corpIdAddSelect option:selected").val();
    //var corpNameAdd = $(".corpIdAddSelect option:selected").text();
    var corpIdAdd = $("#corpId").val();
    var corpNameAdd = $("#corpName").val();

    if ($.trim(corpIdAdd) == '' || $.trim(corpNameAdd) == '') {
        layer.msg("企业Id或者企业名称不能为空！",{icon:1,time:2000});
        return false;
    }

    var corpAddTaxNo = $("#corpAddTaxNo").val();

    var creditCodeAdd = $("#creditCodeAdd").val();
    var licenseNoAdd = $("#licenseNoAdd").val();
    var customsCodeAdd = $("#customsCodeAdd").val();
    var socialSecurityNoAdd = $("#socialSecurityNoAdd").val();
    var loadingIndex = layer.load(1);
    var taxNos = new Array();
    taxNos = corpAddTaxNo;
    var param = {
        'corpId': corpIdAdd,
        'corpName': corpNameAdd,
        'creditCode': creditCodeAdd,
        'taxNos': JSON.stringify(taxNos),
        'licenseNo': licenseNoAdd,
        'customsCode': customsCodeAdd,
        'socialSecurityNo': socialSecurityNoAdd
    };
    var value = $('.addDetail').text();
    var url = baseUrl + "/fipOperaPlan/auditingFetchPlan/createOldCorp";

    $.ajax({
        type: "post",
        url: url,
        async: true,
        data: param,
        dataType: 'json',
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                x_admin_close();
                parent.initPage(1, resultData.returnMessage);
            } else {
                layer.msg(resultData.returnMessage,{icon:5,time:2000});
            }

        },complete: function () {
            layer.close(loadingIndex);
        }

    });
}


