layui.use(['form', 'layer', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element;

    var taxNo = getUrlParam("taxNo");
    queryInstallBaseInfo(taxNo);
    queryHeartbeatLog(taxNo);

});

//获取安装的基础信息
function queryInstallBaseInfo(taxNo) {
    var param = {};
    param["taxNo"] = taxNo;
    param["salesTaxNo"] = "1,2";
    $.ajax({
        type: "post",
        url: baseUrl + "/fipOperaOutput/terminal/install/log",
        data:JSON.stringify(param),
        contentType:'application/json;charset=utf-8',
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        dataType:"json",
        async: false,
        success: function (data) {
            if(data.returnCode == '200'){
                var list = data.data.list || {};
                var hasOutputInvoice;
                if(list[0].hasOutputInvoice == true){
                    hasOutputInvoice = '有';
                }else{
                    hasOutputInvoice = '无';
                }
                $("#corpName").val(list[0].corpName);
                $("#hasOutputInvoice").val(hasOutputInvoice);
                $("#taxNo").val(list[0].taxNo);
                $("#invoiceTaxNos").val(list[0].invoiceTaxNos);
                $("#installTime").val(list[0].createTime);
                $("#orgNo").val(list[0].orgNo);
                $("#orgName").val(list[0].orgName);
            }
        }
    });
}

//获取心跳日志
function queryHeartbeatLog(taxNo) {
    var param = {};
    param["taxNo"] = taxNo;
    $.ajax({
        type: "post",
        url: baseUrl + "/fipOperaOutput/terminal/heartbeat/log",
        data:JSON.stringify(param),
        contentType:'application/json;charset=utf-8',
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success: function (data) {
            if(data.returnCode == '200'){
                var list = data.data.list || {};
                var tbody='';
                for(var i=0; i<list.length; i++){
                    var content = list[i];
                    tbody += "<tr>";
                    tbody += "<td style=\"text-align: center\">"+(i+1)+"</td>";
                    tbody += "<td style=\"text-align: center\">"+list[i].heartbeatTime+"</td>";
                    tbody += "</tr>";
                }
                $('#heartbeatList').html(tbody);
            }
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
