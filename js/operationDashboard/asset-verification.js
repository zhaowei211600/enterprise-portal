layui.config({
    base: 'module/'
}).extend({
    treetable: '../../../lay/module/treetable-lay/treetable'
}).use(['treetable', 'layer','element'], function () {
    var layer = layui.layer, element = layui.element, treetable = layui.treetable;
    var org = function() {
        layer.load(2);
        $.ajax({
            url: baseUrl +"/dashBoard/getOrgCheckedNum",
            type: "get",
            contentType: "application/json;charset=utf-8",
            crossDomain: true == !(document.all),
            beforeSend: function(request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    if (resultData.data != null) {
                        var list = resultData.data.resultList;
                        treetable.render({
                            treeColIndex: 1,
                            treeSpid: 0,
                            treeIdName: 'id',
                            treePidName: 'pid',
                            treeDefaultClose: false,
                            // 父级展开时是否自动展开所有子级
                            treeLinkage: false,
                            elem: '#orgList',
                            data: list,
                            cols: [[
                                {type: 'numbers'},
                                {field: 'org_name', title: '机构'},
                                {field: 'total_num', title: '用户总数'},
                                {field: 'increment', title: '本周新增'}
                            ]],
                            done: function () {
                                $("#orgList").next("div .treeTable").children(".layui-table-box").children(".layui-table-body").children("table").find("tbody").append(get_table_html(list, "d1"));
                            }
                        });
                    } else {
                        $('#orgList').html("");
                    }
                }
                return false;
            },
            complete: function () {
                layer.closeAll('loading');
            }
        });
    };

    var get_table_html = function (list, ele_id) {
        var total_num_sum = 0, incre_num_sum = 0;
        for (var i = 0; i < list.length; i++) {
            var content = list[i];
            total_num_sum += Number(content.total_num);
            incre_num_sum += Number(content.increment);
        }
        var html = "<tr>";
        html += "<td></td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>合计</span></div></td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>" + total_num_sum + "</td>";
        html += "<td class='layui-table-cell laytable-cell-1-org_name' style=\"text-align: left;\"><div class='layui-table-cell'><span class='treeTable-icon'>" + incre_num_sum + "</td>";
        html += "</tr>";
        $("#" + ele_id).html(total_num_sum);
        return html;
    };

    var checkInvoice = function () {
        $("#time").html('');
        layer.load(2);
        $.ajax({
            url: baseUrl +"/dashBoard/queryCheckedNum",
            type: "get",
            contentType: "application/json;charset=utf-8",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    if (resultData.data != null) {
                        $("#time").html("统计截止时间 :"+resultData.data.setTime);
                        treetable.render({
                            treeColIndex: 1,
                            treeSpid: 0,
                            treeIdName: 'id',
                            treePidName: 'pid',
                            treeDefaultClose: false,
                            // 父级展开时是否自动展开所有子级
                            treeLinkage: false,
                            elem: '#portalList',
                            data: resultData.data.portalList,
                            cols: [[
                                {type: 'numbers'},
                                {field: 'org_name', title: '机构'},
                                {field: 'total_num', title: '核验总数'},
                                {field: 'increment', title: '本周新增'}
                            ]],
                            done: function () {
                                $("#portalList").next("div .treeTable").children(".layui-table-box").children(".layui-table-body").children("table").find("tbody").append(get_table_html(resultData.data.portalList, "d2"));
                            }
                        });
                        treetable.render({
                            treeColIndex: 1,
                            treeSpid: 0,
                            treeIdName: 'id',
                            treePidName: 'pid',
                            treeDefaultClose: false,
                            // 父级展开时是否自动展开所有子级
                            treeLinkage: false,
                            elem: '#platformList',
                            data: resultData.data.platformList,
                            cols: [[
                                {type: 'numbers'},
                                {field: 'org_name', title: '机构'},
                                {field: 'total_num', title: '核验总数'},
                                {field: 'increment', title: '本周新增'}
                            ]],
                            done: function () {
                                $("#platformList").next("div .treeTable").children(".layui-table-box").children(".layui-table-body").children("table").find("tbody").append(get_table_html(resultData.data.platformList, "d3"));
                            }
                        });
                    } else {
                        $('#portalList').html("");
                        $('#platformList').html("");
                    }
                }
                return false;
            },
            complete: function () {
                layer.closeAll('loading');
            }
        });
    };
    org();
    checkInvoice();
});