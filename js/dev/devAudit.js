//var curPage = 1;
var pageSize = 10;
var pages = 1;
var total = 0;

layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element;

    getDevAudit(null);

});
function getDevAudit(curPage) {
    curPage = isInteger(curPage) ? curPage : 1;
    var orgName = $('#simpleOrgName').val();
    var email = $('#queryEmail').val();
    var phone = $('#queryPhone').val();
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    if(startDate != ''){
        startDate = startDate + ' 00:00:00';
    }
    if(endDate != ''){
        endDate = endDate + ' 23:59:59';
    }
    var status = $('#queryStatus').val();

    //提交表单 时调用的发方法
    var param = {};
    param["orgName"] = orgName;
    param["email"] = email;
    param["phone"] = phone;
    param["startDate"] = startDate;
    param["endDate"] = endDate;
    if(status >= 0){
        param["status"] = status;
    }
    param["pageNum"] = curPage;
    param["pageSize"] = pageSize;
    var loadingIndex = layer.load(1);
    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl +"/fipOperaApi/operation/register/info",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                var list = resultData.data.list || {};
                pages = resultData.data.pages;
                total = resultData.data.total;
                var tbody='';
                for(var i=0; i<list.length; i++){
                    var content = list[i];
                    tbody += "<tr>";
                    tbody += "<td>"+(i+1)+"</td>";
                    tbody += "<td>"+content.orgName+"</td>";
                    tbody += "<td>"+content.phone+"</td>";
                    tbody += "<td>"+content.email+"</td>";
                    tbody += "<td>"+content.registerTime+"</td>";
                    if(content.status == 0){
                        tbody += "<td>待审核</td>";
                    }else if(content.status == 1) {
                        tbody += "<td>审核通过</td>";
                    }else {
                        tbody += "<td>驳回</td>";
                    }

                    tbody += "<td>"+content.auditor+"</td>";
                    if(content.auditTime == null){
                        tbody += "<td></td>";
                    }else {
                        tbody += "<td>"+content.auditTime+"</td>";
                    }
                    if(content.status == 0){
                        tbody += "<td class=\"td-manage\">" +
                            "<a title=\"审核\"  onclick=\"x_admin_show('开发者审核','./edit.html?id="+ content.registerId +"',800,550,)\" href=\"javascript:;\">\n" +
                            "<i class=\"layui-icon\">&#xe642;</i></a>";
                    }else {
                        tbody += "<td></td>";
                    }
                    tbody += "</tr>";
                }
                $('#devAuditList').html(tbody);
            }else {
                total = 0;
                $('#devAuditList').html('');
            }
            paging(total,curPage);
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });

}


function paging(total,curPage) {
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage.render({
            elem : 'devAuditPageDiv'
            ,count : total
            ,limit : 10
            ,curr : curPage
            ,jump: function(obj, first){
                curPage = obj.curr;
                //首次不执行
                if(!first){
                    getDevAudit(curPage)
                }
            }
        });
    });
}

function isInteger(obj) {
    return typeof obj === 'number' && obj%1 === 0
}