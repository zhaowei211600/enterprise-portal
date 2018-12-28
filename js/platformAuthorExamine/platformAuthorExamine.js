var curPage = 1;
var pageSize = 10;
var pages = 1;
var total = 0;

var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        getDevAudit();
    });
});

function getDevAudit() {

    var pageNum = curPage;
    var pageSize = pageSize;
    var status = $("#state").val();
    var phone = $("#phone").val();
    var beginDate = getStartDate($("#startDate").val());
    var endDate = getEndDate($("#endDate").val());
    //提交表单 时调用的发方法
    var param = {
        pageNum: pageNum,
        pageSize: pageSize,
        phone: phone,
        status: status,
        beginDate: beginDate,
        endDate: endDate
    };
    var loadingIndex = layer.load(1);
    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl + "/auditing/getAll",
        type: "post",
        contentType: "application/json;charset=UTF-8",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    var list = resultData.data.list;
                    pages = resultData.data.pages;
                    total = resultData.data.total;
                    var tbody = '';
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        tbody += "<tr>";
                        tbody += "<td>" + (i + 1) + "</td>";
                        if (content.phone != null) {
                            tbody += "<td>" + content.phone + "</td>";
                        }else{
                            tbody += "<td></td>";
                        }

                        tbody += "<td>" + content.orgName + "</td>";
                        tbody += "<td>" + content.corpName + "</td>";
                        tbody += "<td>征信报告授权</td>";
                        tbody += "<td>" + content.createTime + "</td>";
                        if (content.status == '1') {
                            tbody += "<td>通过</td>";
                        } else if (content.status == '2') {
                            tbody += "<td>待审核</td>";
                        } else {
                            tbody += "<td>审核失败</td>";
                        }
                        if (content.auditName != null) {
                            tbody += "<td>" + content.auditName + "</td>";
                        } else {
                            tbody += "<td></td>";
                        }
                        if (content.auditTime != null) {
                            tbody += "<td>" + content.auditTime + "</td>";
                        } else {
                            tbody += "<td></td>";
                        }

                        if (content.status == '2') {
                            tbody += "<td class=\"td-manage\">" + "<a title=\"审核\" onclick=\"x_admin_show('平台授权审核','../../html/platformAuthor/platformAuthor-edit.html?id=" + content.id + "' ,830,600)\" " +
                                "href=\"javascript:;\">\n" +
                                "<i class=\"layui-icon\">&#xe642;</i></a>";
                            "</td>";
                        } else {
                            tbody += "<td class=\"td-manage\">"

                            "</td>";
                        }
                        tbody += "</tr>";
                    }
                    $('#platformAuthor').html(tbody);
                } else {
                    total = 0;
                    $('#platformAuthor').html("");
                }
                paging(total);
            }else {
                total = 0;
                $('#platformAuthor').html("");
                paging(total);
            }
        },complete: function () {
            layer.close(loadingIndex);
        }
    });

}


//分野
function paging(total) {
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'pageDiv'
            , count: total
            , limit: 10
            , curr: curPage
            , jump: function (obj, first) {
                curPage = obj.curr;
                //首次不执行
                if (!first) {
                    getDevAudit()
                }
            }
        });
    });
    $('#totalNum').text('共有数据：' + total + ' 条');
}


//模糊查询
function searchExpand() {
    $('#platformAuthor').html("")
    getDevAudit();
}

function initPage(icon, msg) {
    layer.msg(msg,{icon:icon,time:2000});
    inittable();
}

function getStartDate(time) {
    if (time === 'undefined') {
        return '';
    }
    if (time != ''){
        return time + ' 00:00:00';
    }else{
        return time;
    }
}

function getEndDate(time) {
    if (time === 'undefined') {
        return '';
    }
    if (time != ''){
        return time + ' 23:59:59';
    }else{
        return time;
    }
}
