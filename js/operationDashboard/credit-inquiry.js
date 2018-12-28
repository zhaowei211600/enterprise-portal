var layer = null,
    element = null;
$(function () {
    layui.use(['layer', 'element'], function () {
        layer = layui.layer, element = layui.element;
        getWorkerCount();
        terminalCount();
        openApiLogCount();
    });
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
                var tbody = '';
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    var orgName = content.orgName;
                    var allCount = content.allCount;
                         allCountTotal = allCountTotal + allCount;
                    var weekCount = content.weekCount;
                         allCountweekCount = allCountweekCount + weekCount;
                    var weekSuccessCount = content.weekSuccessCount;
                         allCountWeekSuccessCount = allCountWeekSuccessCount + weekSuccessCount;
                    var weekFailCount = content.weekFailCount;
                         allCountFailCount = allCountFailCount + weekFailCount;
                    tbody += "<tr>";
                    if (orgName.length > 0) {
                        tbody += "<td  style=\"text-align: left;\">" + orgName + "</td>";
                    }else{
                        tbody += "<td></td>";
                    }
                    tbody += "<td>" + allCount + "</td>";
                    tbody += "<td>" + weekCount + "</td>";
                    tbody += "<td>" + weekSuccessCount + "</td>";
                    tbody += "<td>" + weekFailCount + "</td>";
                    tbody += "</tr>";
                }
                tbody += "<tr><td>合计</td><td>"+allCountTotal+"</td><td>"+allCountweekCount+"</td><td>"+allCountWeekSuccessCount+"</td><td>"+allCountFailCount+"</td></tr>";
                $('#incomeList').html(tbody);
                $('#outPutCount').html(allCountTotal);
            } else {
                $('#incomeList').html("");
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
        url: baseUrl + "/fipOperaOutput/terminal/log/count",
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
                var tbody = '';
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    var orgName = content.orgName;
                    var allCount = content.allCount;
                    allCountTotal = allCountTotal + allCount;
                    var weekCount = content.weekCount;
                    allCountweekCount = allCountweekCount + weekCount;
                    tbody += "<tr>";
                    if (orgName.length > 0) {
                        tbody += "<td style=\"text-align: left;\">" + orgName + "</td>";
                    }else{
                        tbody += "<td style=\"text-align: left;\">其它</td>";
                    }
                    tbody += "<td>" + allCount + "</td>";
                    tbody += "<td>" + weekCount + "</td>";
                    tbody += "</tr>";
                }
                tbody += "<tr><td>合计</td><td>"+allCountTotal+"</td><td>"+allCountweekCount+"</td></tr>";
                $('#installList').html(tbody);
                $('#terminalCount').html(allCountTotal);
            } else {
                $('#installList').html("");
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
        url: baseUrl + "/fipOperaApi/api/log/count",
        contentType: 'application/json;charset=utf-8',
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (model) {
            if (model.success) {
                var allCountTotal = 0;
                var allCountweekCount = 0;
                var list = model.model || {};
                var tbody = '';
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    var orgName = content.orgName;
                    var allCount = content.allCount;
                    allCountTotal = allCountTotal + allCount;
                    var weekCount = content.weekCount;
                    allCountweekCount = allCountweekCount + weekCount;
                    tbody += "<tr>";
                    if (orgName.length > 0) {
                        tbody += "<td style=\"text-align: left;\">" + orgName + "</td>";
                    }else{
                        tbody += "<td style=\"text-align: left;\">其它</td>";
                    }
                    tbody += "<td>" + allCount + "</td>";
                    tbody += "<td>" + weekCount + "</td>";
                    tbody += "</tr>";
                }
                tbody += "<tr><td>合计</td><td>"+allCountTotal+"</td><td>"+allCountweekCount+"</td></tr>";
                $('#reportList').html(tbody);
                $('#openApiLogCount').html(allCountTotal);
            } else {
                $('#reportList').html("");
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });
}