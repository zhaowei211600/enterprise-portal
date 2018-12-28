//var curPage = 1;
var pageSize = 10;
var pages = 1;
var total = 0;

layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element;
    getOrgUserList(null);
});

function getOrgUserList(curPage) {
    curPage = isInteger(curPage) ? curPage : 1;
    var userName = $('#userName').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var startDate = getStartDate($('#beginDate').val());
    var endDate = getEndDate($('#endDate').val());
    var state = $("#state").val();

    //提交表单 时调用的发方法
    var param = {};
    param["name"] = userName;
    param["email"] = email;
    param["phone"] = phone;
    param["beginDate"] = startDate;
    param["endDate"] = endDate;
    param["state"] = state;
    param["pageNum"] = curPage;
    param["pageSize"] = pageSize;
    var loadingIndex = layer.load(1);
    $.ajax({
        type: "post",
        data: JSON.stringify(param),
        url: baseUrl +"/orgUser/list",
        contentType:'application/json;charset=utf-8',
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success: function (data) {
            if(data.returnCode == '200'){
                pages = data.data.pages;
                total = data.data.total;
                var list = data.data.list || {};
                var tbody='';
                for(var i=0; i<list.length; i++){
                    var content = list[i];
                    var state;
                    if(content.state == 3){
                        state = '待审核';
                    }else if(content.state == 4){
                        state = '审核通过';
                    }else if(content.state == 5){
                        state = '审核驳回';
                    }
                    var updateTime = content.updateTime || '';
                    var auditTime = content.auditTime || '';
                    tbody += "<tr>";
                    tbody += "<td>"+(i+1)+"</td>";
                    tbody += "<td>"+content.name+"</td>";
                    tbody += "<td>"+content.phone+"</td>";
                    tbody += "<td>"+content.email+"</td>";
                    tbody += "<td>"+updateTime+"</td>";
                    tbody += "<td>"+state+"</td>";
                    tbody += "<td>"+content.auditor+"</td>";
                    tbody += "<td>"+auditTime+"</td>";
                    tbody += "<td class=\"td-manage\">" +
                        "<a title=\"审核\"  onclick=\"x_admin_show('审核','./edit.html?id="+ content.id +"',800,550,)\" href=\"javascript:;\">\n" +
                        "<i class=\"layui-icon\">&#xe642;</i></a>";
                    tbody += "</tr>";
                }
                $('#userList').html(tbody);

            }else{
                total = 0;
                $('#userList').html("");
            }
            paging(total,curPage);
        },complete: function () {
            layer.close(loadingIndex);
        }
    });


}

function paging(total,curPage) {
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage.render({
            elem : 'userPageDiv'
            ,count : total
            ,limit : 10
            ,curr : curPage
            ,jump: function(obj, first){
                curPage = obj.curr;
                //首次不执行
                if(!first){
                    getOrgUserList(curPage)
                }
            }
        });
    });
}


function isInteger(obj) {
    return typeof obj === 'number' && obj%1 === 0
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