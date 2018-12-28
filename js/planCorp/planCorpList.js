var totalCounts = 0;
var pageIndex = 1;
var pageSize = 10;
localStorage;
var form = null,layer = null,element = null;
$(document).ready(function(){
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        planList('asc');
    });
});



function planList(sort){
    var loadingIndex = layer.load(1);
    var taxNo = $("#queryCorpTaxNo").val();
    var corpName = $("#queryCorpName").val();
    var param = {
        'pageNum':pageIndex,
        'pageSize':10,
        'order':sort,
        'taxNo':taxNo,
        'corpName':corpName,
        'sort':'applyDate'
    };
    $.ajax({
        type:"post",
        url:baseUrl + "/fipOperaPlan/auditingFetchPlan/corpList",
        async:false,
        data:param,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success:function(data){
            if (data.returnCode == 200) {
                totalCounts = data.data.total;
                var contents = data.data.list ||[];
                    var list = '';
                    var creditCode = '';
                    for (var i =0; i< contents.length ; i++) {
                        creditCode = contents[i].creditCode || '' ;
                        //税号堆积
                        var taxNo = '';
                        for (var j=0;j<contents[i].taxNos.length;j++) {
                            taxNo += contents[i].taxNos[j] + ','
                        }
                        taxNo = taxNo.substring(0,taxNo.length-1)
                        list += '<tr>' +
                            '<td><input type="radio" name="tdChecked"/></td>'+
                            '<td><a class=\"link_a\" href=\"#xq\" onclick = \"applyCode(event)\" name = \"'+contents[i].taxNos[0]+'\">'+contents[i].corpId+'</a></td>'+
                            '<td>'+contents[i].corpName+'</td>'+
                            '<td>'+ taxNo+'</td>'+
                            '<td>'+ creditCode +'</td>'+
                            '<td>'+contents[i].createTime+'</td>'+
                            "<td class=\"td-manage\">" +
                            "<a title=\"销项\"  onclick=\"x_admin_show('销项数据','../../html/planCorp/output.html?corpId="+ contents[i].corpId +"',800,550,)\" href=\"javascript:;\">\n" +
                            "<i class=\"layui-btn\">销项数据</i></a>" +
                            "<a title=\"进项\"  onclick=\"x_admin_show('进项数据','../../html/planCorp/income.html?corpId="+ contents[i].corpId +"',800,550,)\" href=\"javascript:;\">\n" +
                            "<i class=\"layui-btn\">进项数据</i></a>" +
                            "<a title=\"推送\"  onclick=\"viewReport('"+contents[i].corpId+"')\" href=\"javascript:;\">\n" +
                            "<i class=\"layui-btn\">查看报告</i></a>" +
                            "</td>" +
                            "</tr>"
                        ;
                    }
                    $('#planCorpList').html(list);
            }else{
                totalCounts = 0;
                $('#planCorpList').html("");
            }
            paging(totalCounts);
        } ,complete: function () {
            layer.close(loadingIndex);
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
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
            ,curr : pageIndex
            ,jump: function(obj, first){
                pageIndex = obj.curr;
                //首次不执行
                if(!first){
                    planList('asc');
                }
            }
        });
    });
    $('#totalNum').text('共有数据：'+total+' 条');
}

function findQuery() {
    planList('asc');
    //分页
    paging(totalCounts);
}


//编辑页面
function addPlanCorp() {
    var isSelected = $('input[name="tdChecked"]:checked').val();
    if (isSelected == 'undefined' || isSelected == null || isSelected == '') {
        //alert("请选择一条企业数据");
        layer.msg("请选择一条企业数据",{icon:1,time:2000});
        return;
    }
    var corpId = '',corpName = '';
    $('input[name="tdChecked"]:checked').each(function () {
        var tr = $(this).closest('tr'), tds = tr.find('td');
        corpId = tds.eq(1).text();
        corpName = tds.eq(2).text();
    });
    var url = '../../html/planCorp/planCorp-edit.html?corpId='+corpId+'&corpName='+encodeURI((encodeURI(corpName)));
    x_admin_show('添加企业',url,500,500);
}

//调用report里面的接口
function getReportUrl() {
    var isSelected = $('input[name="tdChecked"]:checked').val();
    if (isSelected == 'undefined' || isSelected == null || isSelected == '') {
        layer.msg("请选择一条企业数据",{icon:1,time:2000});
        return;
    }
    var corpId = '';
    $('input[name="tdChecked"]:checked').each(function () {
        var tr = $(this).closest('tr'), tds = tr.find('td');
        corpId = tds.eq(1).text();
    });

    layer.confirm('确认要提交吗？', {
        btn : [ '确定', '取消' ]//按钮
    }, function() {
        var loadingIndex = layer.load(1);
        $.ajax({
            type:"post",
            url:baseUrl + "/fipOperaReport/report/getSaveCreditReport?corpId="+corpId,
            async:false,
            crossDomain: true == !(document.all),
            beforeSend: function(request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);},
            success:function(data){
                if (data.success) {
                    layer.msg("请求成功",{icon:1,time:3000});
                }else {
                    layer.msg("请求失败",{icon:5,time:3000});
                }
            } ,complete: function () {
                layer.close(loadingIndex);
            }
        });
    });


}

function direct(word, taxNo) {
    var cnt = 0;
    var target;
    parent.$('#nav cite').each(function (index, obj) {
        if(word == $(obj).text()){
            target = $(obj).parent('a')[0];
            $(target).prop('_href', '?taxNo='+taxNo);
            target.click();
            cnt++;
            return;
        }
    });
    $(target).removeProp('_href');
    if(cnt != parent.$('#nav cite').length){
        return;
    }
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.msg('无操作权限!', {
            icon : 5,
            time : 2000,
            skin : 'layui-layer-molv',
            closeBtn : 0
        });
    });
}

//详情
function applyCode(event){
    var param = {taxNo:$(event.target).attr('name')};
    $(event.target).css('color','#99CCFF');
    direct('取数计划', param.taxNo);
}

function initPage(icon, msg) {
    layer.msg(msg,{icon:icon,time:2000});
    planList('asc');
}

/**
 * 下载销项数据
 */
function downLoadData() {
    var selected = $('input[name="tdChecked"]:checked');
    var selectedVal = $(selected).val()
    if (selectedVal == 'undefined' || selectedVal == null || selectedVal == '') {
        layer.msg("请选择一条企业数据",{icon:5,time:2000});
        return;
    }
    var corpId = '',corpName = '';
    $(selected).each(function () {
        var tds = $(this).closest('tr').find('td');
        corpId = tds.eq(1).text();
        corpName = tds.eq(2).text();
    });
    layer.confirm('确定要下载【' + corpName + '】的销项数据吗？', {
        btn: ['确定', '取消']
    }, function(index, layero){
        layer.msg("确定",{icon:5,time:2000});

    }, function(index){});
}

function download(url, method, filedir, filename){
    $('<form action="'+url+'" method="'+(method||'post')+'">' +  // action请求路径及推送方法
        '<input type="text" name="filedir" value="'+filedir+'"/>' + // 文件路径
        '<input type="text" name="filename" value="'+filename+'"/>' + // 文件名称
        '</form>')
        .appendTo('body').submit().remove();
};

function viewReport(corpId) {
    //ajax请求
    var loadingIndex = layer.load(1);
    $.ajax({
        type:"get",
        url:baseUrl + "/fipOperaApi/api/report/getReportByCorpId?corpId="+corpId,
        async:false,
        dataType : "json",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success:function(data){
            if (data.returnCode == 200) {
                var data = data.data;
                var result = JSON.stringify(data,null,2);
                localStorage.setItem("report",result);
                var url = '../../html/planCorp/report.html';
                x_admin_show('报告',url,800,500);
            }else {
                layer.msg("未查到数据",{icon:5,time:3000});
            }
        },complete: function () {
            layer.close(loadingIndex);
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function replaceNull(obj) {
    if (null == obj) {
        return "";
    }
    return obj;
}

