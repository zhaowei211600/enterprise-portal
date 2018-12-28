var curPage = 1;
var pageSize = 10;
var pages = 1;
var total = 0;
layui.use('element', function(){
    var element = layui.element;
});
var token = localStorage.getItem('OperaAuthorization');
var tokenString = 'Bearer ' + token;
$(document).ready(function () {

    inittable();

    $('#search_btn').click(function(){
        $('#mytab').bootstrapTable('refresh', {url: baseUrl+"/operation/corp/selection"});
    });
    $('.detailBack').click(function () {

        $('#corpuserxq').css('opacity','1').hide();
    });

});
//替换用layui表格
function inittable() {
    var param = {};
    param["pageNum"] = curPage;
    param["pageSize"] = pageSize;
    param["corpPhoneNumber"] = $("#queryCorpPhone").val();
    param["applyFromTime"] = $("#applyFromTime").val();
    param["applyToTime"] = $("#applyToTime").val();
    param["auditFlag"] = $("#selectAuditFlag").val();
    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl + "/operation/corp/selection",
        type: "post",
        contentType:'application/json;charset=utf-8',
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", tokenString);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data.list;
                pages = resultData.data.pages;
                total = resultData.data.total;
                var tbody = '';
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    tbody += "<tr id='"+content.id+"'>";
                    if ('0'==content.workSource) {
                        tbody += "<td>门户</td>";
                    }else {
                        tbody += "<td>接口</td>";
                    }
                    if (content.orgName == null) {
                        tbody += "<td>无</td>";
                    }else{
                        tbody += "<td>" + content.orgName+ "</td>";
                    }
                    tbody += "<td>" + content.corpName +"</td>";
                    tbody += "<td>" + content.taxNo + "</td>";
                    tbody += "<td><a href=\""+baseUrl+"/file/download?fileName="+content.corpFileName+"\" target='_blank'>电子证书委托书</a></td>";
                    tbody += "<td>" + content.applyTime + "</td>";
                    if ('01'==content.auditFlag) {
                        tbody += "<td>未审核</td>";
                    }else if ('02'==content.auditFlag) {
                        tbody += "<td>审核通过</td>";
                    }else if ('03'==content.auditFlag) {
                        tbody += "<td>审核不通过</td>";
                    }else if ('04'==content.auditFlag) {
                        tbody += "<td>无数据</td>";
                    }
                    tbody += "<td>" + content.auditorName + "</td>";
                    if (content.auditTime == undefined) {
                        tbody += "<td>无</td>";
                    } else {
                        tbody += "<td>" + content.auditTime + "</td>";
                    }

                    tbody += "<td class=\"td-manage\">" +
                        "<a title=\"查看明细\"  onclick=\"x_admin_show('查看工单明细','./html/corpmanage/corpManager-edit.html?workerId="+content.id+"',800,700)\" href=\"javascript:;\">\n" +
                        "<i class=\"layui-icon\">查看明细&#xe642;</i></a>";
                }
                $('#workerList').html(tbody);
            }else {
                $('#workerList').html("");
            }
            paging(total);
        }
    });

}

function paging(total) {
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage.render({
            elem : 'pageDiv'
            ,count : total
            ,limit : 10
            ,curr : curPage
            ,jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                curPage = obj.curr;
                //首次不执行
                if(!first){
                    inittable()
                }
            }
        });
    });
    $('#totalNum').text('共有数据：'+total+' 条');
}


window.detail = {
    "click #detail":function (e,value,row,index) {
        //清除页面加载的缓存数据
        $('#corpPhoneNumber').html('');
        $('#corpOrgNo').html('');
        $('#corpTaxNo').html('');
        $('#auditComment').html('');
        $('#corpName').html('');
        //加载新数据
        $('#corpuserxq').css('opacity','1').show();
        $('#hiddenIdArea').attr('value',row.id);
        if (row.workSource == '0') {
            $('#corpPhoneNumber').html(row.corpPhoneNumber);
        }else {
            $('#corpPhoneNumber').html(row.userName);
        }
        $('#corpOrgNo').html(row.orgName);
        $('#corpTaxNo').html(row.taxNo);
        $('#corpName').html(row.corpName);
        var href = ""+baseUrl+"/file/download?fileName="+row.corpFileName+"";
        $('#qysqzl').attr('href',href);
        $('#auditComment').html(row.auditComment);
        if (row.auditFlag == '01') {
            $("input[name='auditResult'][value='01']").attr("checked",true);
        }else if (row.auditFlag == '02') {
            $("input[name='auditResult'][value='02']").attr("checked",true);
        }else if (row.auditFlag == '03') {
            $("input[name='auditResult'][value='03']").attr("checked",true);
        }else {
            $("input[name='auditResult'][value='04']").attr("checked",true);
        }
        $('#auditArea').show();
        //审核状态如果是02,03则禁用提交按钮
        if (row.auditFlag == '02' || row.auditFlag == '03') {
            $("#auditButton").attr({"disabled":"disabled"});
        }else{
            $("#auditButton").attr({"disabled":false});
        }
    }
}

function auditMessage() {
    var id = $('#hiddenIdArea').val();
    var auditFlag = $('#typeRadio input[name="auditResult"]:checked ').val();
    if (auditFlag != 01 && auditFlag != 02 &&  auditFlag != 03 && auditFlag != 04) {
        alert("请提交正确的审核状态");
        return;
    }
    var auditComment = $("#auditComment").val();
    var data = {
        "id":id,
        "auditFlag":auditFlag,
        "auditComment":auditComment
    }
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": baseUrl+"/operation/corp/audit",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "OperaAuthorization": tokenString
        },
        "processData": false,
        "data": JSON.stringify(data)
    }

    $.ajax(settings).done(function (response) {
        if(response.returnCode != '200'){
            alert(response.returnMessage);
            return false;
        }
        alert(response.returnMessage);
        $('#corpuserxq').css('opacity','1').hide();
        $('#mytab').bootstrapTable('refresh', {url: baseUrl+"/operation/corp/selection"});
    });

}
