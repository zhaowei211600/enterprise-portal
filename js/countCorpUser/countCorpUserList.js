var pageNum = 1;
var pageSize = 10;
var pages = 1;
var total = 0;
var form = null,layer = null,element = null;
$(document).ready(function () {
    $(function(){
        layui.use('form', function(){
            var form = layui.form;
            form.render();
            getCorpUserList(); // 获取企业用户统计列表
        });
    });
});


function updatePageIndex() {
    pageNum = 1;
    getCorpUserList();
}

// 获取企业用户统计列表
function getCorpUserList() {
    var corpName = $('#corpName').val();     //机构名称
    var taxpayerNo = $('#taxpayerNo').val(); //税号
    var startDate = getStartDate($('#startDate').val());   //申请时间的起始时间
    var endDate = getEndDate($('#endDate').val());      //申请时间的结束时间
    var orgCode = $('#orgNo').val(); // 机构编码
    var simpleOrgName = $("#simpleOrgName").val();
    var param = {};
    if(null != simpleOrgName && simpleOrgName != '' && null != orgCode && '' != orgCode){
        param["orgCode"] = orgCode;
    }else{
        param['orgCode'] = '-9999';
    }
    param["corpName"] = corpName;
    param["taxpayerNo"] = taxpayerNo;
    param["beginDate"] = startDate;
    param["endDate"] = endDate;
    //param["pageIndex"] = pageNum;
    param["pageNum"] = pageNum;
    param["pageSize"] = pageSize;
    var loadingIndex = layer.load(1);
    $.ajax({
        type: "post",
        data: JSON.stringify(param),
        url: baseUrl + "/fipOperaCorp/corp/getAuditUserCorpInfoList",
        contentType: 'application/json;charset=utf-8',
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (data) {
            if (data.returnCode == '200') {
                pages = data.data.pages;
                total = data.data.total;
                var list = data.data.list || {};
                var tbody = '';
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    var createTime = content.createTime || '';
                    var applicationTime = content.applicationTime || '';
                    var corpName = content.corpName || '';
                    var taxpayerNo = content.taxpayerNo || '';
                    var orgName = content.orgName || '';
                    tbody += "<tr>";
                    tbody += "<td>" + (i + 1) + "</td>";
                    tbody += "<td>" + corpName + "</td>";
                    tbody += "<td>" + taxpayerNo + "</td>";

                    tbody += "<td>" + orgName + "</td>";
                    tbody += "<td>" + createTime + "</td>";
                    tbody += "<td>" + applicationTime +"</td>";
                    tbody += "<td class=\"td-manage\">" +
                        "<a title=\"\"  onclick=\"x_admin_show('企业信息','../../html/countCorpuser/countCorpUser-edit.html?id="+content.id+"',800,600)\" href=\"javascript:;\">\n" +
                        "<i class=\"layui-icon\">&#xe642;</i></a>";
                    "</td>";
                    tbody += "</tr>";
                }
                $('#corp_user_table').html(tbody);

            } else {
                total = 0;
                $('#corp_user_table').html("");
            }
            paging(total);
        },complete: function () {
            layer.close(loadingIndex);
        }
    });

}




//分野
function paging(total) {
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage.render({
            elem : 'pageDiv'
            ,count : total
            ,limit : 10
            ,curr : pageNum
            ,jump: function(obj, first){
                pageNum = obj.curr;
                //首次不执行
                if(!first){
                    getCorpUserList()
                }
            }
        });
    });
    $('#totalNum').text('共有数据：'+total+' 条');
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