layui.config({
    base: 'module/'
}).extend({
    treetable: '../../../lay/module/treetable-lay/treetable'
}).use(['treetable', 'layer','element'], function () {
    var layer = layui.layer, element = layui.element, treetable = layui.treetable;
    var getWorkerCountTree = function() {
        layer.load(2);
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
                        var list = data.data || {};
                        treetable.render({
                            treeColIndex: 1,
                            treeSpid: 0,
                            treeIdName: 'orgNo',
                            treePidName: 'parentOrgNo',
                            treeDefaultClose: false,
                            // 父级展开时是否自动展开所有子级
                            treeLinkage: false,
                            elem: '#incomeTree',
                            data: list,
                            cols: [[
                                {type: 'numbers'},
                                {field: 'orgName', title: '机构'},
                                {field: 'allCount', title: '用户总数'},
                                {field: 'weekCount', title: '本周新增'},
                                {field: 'weekSuccessCount', title: '本周审核通过'},
                                {field: 'weekFailCount', title: '本周审核失败'}
                            ]],
                            done: function () {
                                $("#incomeTree").next("div .treeTable").children(".layui-table-box").children(".layui-table-body").children("table").find("tbody").append(get_count_List_more(list, "outPutCount"));
                            }
                        });
                }else{
                    $('#incomeTree').html("");
                }
                return false;
            },
            complete: function () {
                layer.closeAll('loading');
            }
        });
    };

    var terminalCountTree = function() {
        layer.load(2);
        $.ajax({
            url: baseUrl +"/operation/terminal/log/count",
            type: "post",
            contentType: "application/json;charset=utf-8",
            crossDomain: true == !(document.all),
            beforeSend: function(request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (data) {
                if (data.success) {
                        var list = data.data || {};
                        treetable.render({
                            treeColIndex: 1,
                            treeSpid: 0,
                            treeIdName: 'orgNo',
                            treePidName: 'parentOrgNo',
                            treeDefaultClose: false,
                            // 父级展开时是否自动展开所有子级
                            treeLinkage: false,
                            elem: '#installTree',
                            data: list,
                            cols: [[
                                {type: 'numbers'},
                                {field: 'orgName', title: '机构'},
                                {field: 'allCount', title: '用户总数'},
                                {field: 'weekCount', title: '本周新增'}
                            ]],
                            done: function () {
                                $("#installTree").next("div .treeTable").children(".layui-table-box").children(".layui-table-body").children("table").find("tbody").append(get_count_List(list, "terminalCount"));
                            }
                        });
                }else{
                    $('#installTree').html("");
                }
                return false;
            },
            complete: function () {
                layer.closeAll('loading');
            }
        });
    };

    var openApiLogCountTree = function() {
        layer.load(2);
        $.ajax({
            url: baseUrl +"/operation/api/log/count",
            type: "post",
            contentType: "application/json;charset=utf-8",
            crossDomain: true == !(document.all),
            beforeSend: function(request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (data) {
                if (data.success) {
                        var list = data.data || {};
                        //统计总量
                        treetable.render({
                            treeColIndex: 1,
                            treeSpid: 0,
                            treeIdName: 'orgNo',
                            treePidName: 'parentOrgNo',
                            treeDefaultClose: false,
                            // 父级展开时是否自动展开所有子级
                            treeLinkage: false,
                            elem: '#reportTree',
                            data: list,
                            cols: [[
                                {type: 'numbers'},
                                {field: 'orgName', title: '机构'},
                                {field: 'allCount', title: '用户总数'},
                                {field: 'weekCount', title: '本周新增'}
                            ]],
                            done: function () {
                                $("#reportTree").next("div .treeTable").children(".layui-table-box").children(".layui-table-body").children("table").find("tbody").append(get_count_List(list, "openApiLogCount"));
                            }
                        });
                }else{
                    $('#reportTree').html("");
                }
                return false;
            },
            complete: function () {
                layer.closeAll('loading');
            }
        });
    };

    var get_count_List = function (list, ele_id) {
        var total_num_sum = 0, incre_num_sum = 0;
        for (var i = 0; i < list.length; i++) {
            var content = list[i];
            total_num_sum += Number(content.allCount);
            incre_num_sum += Number(content.weekCount);
        }

        $("#" + ele_id).html(total_num_sum);
        // var resultList = {"orgName":"合计","orgNo":"-9999","parentOrgNo":"0","allCount":total_num_sum,"weekCount":incre_num_sum};
        var html = "<tr>";
        html += "<td></td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>合计</span></div></td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>" + total_num_sum + "</td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>" + incre_num_sum + "</td>";
        html += "</tr>";
        return html;
    };

    var get_count_List_more = function (list, ele_id) {
        var total_num_sum = 0, week_num_sum = 0, week_success_sum = 0, week_fail_sum = 0;
        for (var i = 0; i < list.length; i++) {
            var content = list[i];
            total_num_sum += Number(content.allCount);
            week_num_sum += Number(content.weekCount);
            week_success_sum += Number(content.weekSuccessCount);
            week_fail_sum += Number(content.weekFailCount);
        }
        $("#" + ele_id).html(total_num_sum);
        var html = "<tr>";
        html += "<td></td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>合计</span></div></td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>" + total_num_sum + "</td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>" + week_num_sum + "</td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>" + week_success_sum + "</td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>" + week_fail_sum + "</td>";
        html += "</tr>";
        return html;
    };
    getWorkerCountTree();
    terminalCountTree();
    openApiLogCountTree();
});