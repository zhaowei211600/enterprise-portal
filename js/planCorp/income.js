var corpId;
layui.use(['form', 'layer', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element;

    corpId = getUrlParam("corpId");
    querySumAmountByMonth();
    queryCountInvoice();

});

//获取安装的基础信息
function queryCountInvoice() {
    $.ajax({
        type: "post",
        url: baseUrl + "/fipOperaIncome/income/invoice/count?corpId="+corpId,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        dataType:"json",
        async: false,
        success: function (data) {
            console.log(data)
            if(data.returnCode == '200'){
                $("#totalAmount").val(data.data.totalAmount);
                $("#totalCount").val(data.data.totalCount);
            }
        }
    });
}

function querySumAmountByMonth() {
    $.ajax({
        type: "post",
        url: baseUrl + "/fipOperaIncome/income/invoice/sum?corpId="+corpId,
        contentType:'application/json;charset=utf-8',
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success: function (data) {
            console.log(data);
            if(data.returnCode == '200'){
                var list = data.data || {};
                var tbody='';
                for(var i=0; i<list.length; i++){
                    var content = list[i];
                    tbody += "<tr>";
                    tbody += "<td style=\"text-align: center\">"+(i+1)+"</td>";
                    tbody += "<td style=\"text-align: center\">"+ content.year +"</td>";
                    tbody += "<td style=\"text-align: center\">"+ content.month +"</td>";
                    tbody += "<td style=\"text-align: center\">"+ content.amount +"</td>";
                    tbody += "</tr>";
                }
                $('#incomeList').html(tbody);
            }else{
                $('#incomeList').html("<tr><td colspan='4' style='text-align: center'>暂无数据！</td></tr>");
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
