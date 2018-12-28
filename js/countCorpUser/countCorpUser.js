var token = localStorage.getItem('OperaAuthorization');

$(document).ready(function (){
    var id = getUrlParam("id");

    layui.use(['element','layer'], function(){
        var element = layui.element;
        layer = layui.layer;
        //获取企业信息
        getCorpDetail(id);
    });
});

//页面参数传递
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


/**
 * 通过UserId获取企业信息
 */
function getCorpDetail(id) {
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/fipOperaCorp/corp/getCorpDetail?id=" + id,
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var data = resultData.data || {};
                $("#corpNameDev").val(data.corpName);
                $("#taxpayerNoDev").val(data.taxpayerNo);
                $("#orgNameDev").val(data.orgName);
                $("#applyTimeDev").val(data.createTime);
                $("#auditTimeDev").val(data.applicationTime);
                var incomeStr = "未通过";
                if(data.digitStatus == "00"){
                    incomeStr = "未通过";
                }else if(data.digitStatus == "01"){
                    incomeStr = "未审核";
                }else if(data.digitStatus == "02"){
                    incomeStr = "审核通过";
                }else if(data.digitStatus == "03"){
                    incomeStr = "审核驳回";
                }
                $("#incomeStr").val(incomeStr);
                var outputStr = "未通过";
                if(data.collectStatus == "00"){
                    outputStr = "未通过";
                }else if(data.collectStatus == "01"){
                    outputStr = "未审核";
                }else if(data.collectStatus == "02"){
                    outputStr = "审核通过";
                }else if(data.collectStatus == "03"){
                    outputStr = "审核驳回";
                }
                $("#outputStr").val(outputStr);
                var incomeFile = data.digitUrl;
                $("#incomeFile").val(incomeFile)
                var outputFile = data.collectUrl;
                $("#outputFile").val(outputFile)

                $("#businessUrl").val(data.businessUrl);
                $("#legalUrl").val(data.legalUrl);
                $("#taxUrl").val(data.taxUrl);
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });
}



function downloadFile(type) {
    var fileUrl = "";
    if(type == 1){
        fileUrl = $("#businessUrl").val();
    }else if(type == 2){
        fileUrl = $("#legalUrl").val();
    }else if(type == 3){
        fileUrl = $("#taxUrl").val();
    } else if(type == 4){
        fileUrl = $("#incomeFile").val();
    }else if(type == 5){
        fileUrl = $("#outputFile").val();
    }
    if(fileUrl == null || fileUrl == ""){
        layer.msg("未上传该文件", {icon: 5, time:3000});
    }else{
        window.location.href = baseUrl + "/file/download?fileName=" + fileUrl
    }

}


