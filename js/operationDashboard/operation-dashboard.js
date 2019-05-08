var layer = null,
    element = null;
layui.use(['layer', 'element'], function () {
    layer = layui.layer, element = layui.element;
    orgCheckedNum();
    invoiceCheckedNum();
    getWorkerCount();
    terminalCount();
    openApiLogCount();
});

//工单统计
function getWorkerCount() {
    var loadingIndex = layer.load(1);
    $.ajax({
        type: "post",
        url: baseUrl + "/operation/worker/count",
        contentType: 'application/json;charset=utf-8',
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (data) {
            if (data.success) {
                var allCountTotal = 0;
                var allCountweekCount = 0;
                var allCountWeekSuccessCount = 0;
                var allCountFailCount = 0;
                var list = data.data || {};
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    var allCount = content.allCount;
                    allCountTotal = allCountTotal + allCount;
                    var weekCount = content.weekCount;
                    allCountweekCount = allCountweekCount + weekCount;
                    var weekSuccessCount = content.weekSuccessCount;
                    allCountWeekSuccessCount = allCountWeekSuccessCount + weekSuccessCount;
                    var weekFailCount = content.weekFailCount;
                    allCountFailCount = allCountFailCount + weekFailCount;
                }
                $("#terminalAll").html(allCountTotal);
                $("#terminalweek").html(allCountweekCount);
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });
}

//插件安装统计
function terminalCount() {
    var loadingIndex = layer.load(1);
    $.ajax({
        type: "post",
        url: baseUrl + "/operation/terminal/log/count",
        contentType: 'application/json;charset=utf-8',
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (data) {
            if (data.success) {
                var allCountTotal = 0;
                var allCountweekCount = 0;
                var list = data.data || {};
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    var allCount = content.allCount;
                    allCountTotal = allCountTotal + allCount;
                    var weekCount = content.weekCount;
                    allCountweekCount = allCountweekCount + weekCount;
                }
                $("#outputAll").html(allCountTotal);
                $("#outputWeek").html(allCountweekCount);
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });
}

//报告统计
function openApiLogCount() {
    var loadingIndex = layer.load(1);
    $.ajax({
        type: "post",
        url: baseUrl + "/operation/api/log/count",
        contentType: 'application/json;charset=utf-8',
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (data) {
            if (data.success) {
                var allCountTotal = 0;
                var allCountweekCount = 0;
                var list = data.data || {};
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    var allCount = content.allCount;
                    allCountTotal = allCountTotal + allCount;
                    var weekCount = content.weekCount;
                    allCountweekCount = allCountweekCount + weekCount;
                }
                $("#openApiAll").html(allCountTotal);
                $("#openApiWeek").html(allCountweekCount);
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });
}

/**
 * 资产核验-核验用户汇总
 */
function orgCheckedNum() {
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl +"/fipOperaOrg/orgUser/getOrgCheckedTotal",
        type: "get",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    var list = resultData.data;
                    $("#d11").html(list[0]);
                    $("#d12").html(list[1]);
                } else {
                    $('#d11').html("");
                    $('#d12').html("");
                }
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

/**
 * 资产核验-机构门户核验汇总/开放平台核验汇总
 */
function invoiceCheckedNum() {
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl +"/fipOperaInvoice/invoice/queryCheckedTotal",
        type: "get",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    var list = resultData.data;
                    $("#d21").html(list[0]);
                    $("#d22").html(list[1]);
                    $("#d31").html(list[2]);
                    $("#d32").html(list[3]);
                } else {
                    $('#d21').html("");
                    $('#d22').html("");
                    $('#d31').html("");
                    $('#d32').html("");
                }
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
};