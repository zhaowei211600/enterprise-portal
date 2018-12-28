var totalCounts = 0;
var pageIndex = 1;
var pageSize = 10;

var form = null,layer = null,element = null;
$(document).ready(function(){
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        form.render();
        //planList('asc');
        var taxNoPragram = GetQueryString("taxNo");
        $("#queryCorpTaxNo").val(taxNoPragram);
        findQuery();
    });
});


function planList(sort){
    var taxNo = $("#queryCorpTaxNo").val();
    var corpId = $("#queryCorpId").val();
    var fetchType = $("#queryFetchType option:selected").val();
    var planType = $("#queryPlanType option:selected").val();
    var param = {
        'pageNum':pageIndex,
        'pageSize':10,
        'order':sort,
        'taxNo':taxNo,
        'corpId':corpId,
        'fetchType':fetchType,
        'planType':planType,
        'sort':'applyDate'
    };
    var loadingIndex = layer.load(1);
    $.ajax({
        type:"post",
        url:baseUrl + "/fipOperaPlan/auditingFetchPlan/planList",
        async:false,
        data:param,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success:function(data){
            pages = data.data.pages;
            $('#totalData').text(totalCounts)
            var contents = data.data.list ||[];
            if (contents.length > 0) {
                totalCounts = data.data.total;
                $('tr.odd').hide();
                var list = '';
                for (var i =0; i< contents.length ; i++) {
                    var finishTime = contents[i].finishTime || '';
                    var fetchType = Number(contents[i].fetchType);
                    var planType = Number(contents[i].planType);
                    var statueString = '';
                    var planTypeString = '';
                    switch (fetchType){
                        case 0:
                            statueString = '未开始';
                            break;
                        case 1:
                            statueString = '已完成';
                            break;
                        case 2:
                            statueString = '异常状态';
                            break;
                        case 9:
                            statueString = '已废除';
                            break;
                        default:
                            break;
                    }
                    switch (planType){
                        case 1:
                            planTypeString = '销项';
                            break;
                        case 2:
                            planTypeString = '进项';
                            break;
                        case 3:
                            planTypeString = '工商';
                            break;
                        case 4:
                            planTypeString = '申报';
                            break;
                        case 5:
                            planTypeString = '日志';
                            break;
                        default:
                            break;
                    }


                    list += '<tr>' +
                        '<td><input type="radio" name="tdChecked"/></td>'+
                        '<td><a href="#xq" class=\"link_a\" onclick = "viewPlanCount('+contents[i].batchNumber+', this)">'+contents[i].batchNumber+'</a></td>'+
                        '<td>'+contents[i].corpId+'</td>'+
                        '<td>'+contents[i].startTime+'</td>'+
                        '<td>'+contents[i].endTime+'</td>'+
                        '<td>'+statueString+'</td>'+
                        '<td>'+finishTime+'</td>'+
                        '<td>'+planTypeString+'</td>';
                    if(fetchType == 1 && planType == 5){
                        list += '<td class="td-manage"> ' +
                            '<a title="修改" onclick="updatePlanCount('+contents[i].batchNumber+',\''+contents[i].corpId+'\')" href="javascript:;"> <i class="layui-icon">&#xe642;</i></a>' +
                            '<a title="下载" href="'+baseUrl+'/terminal/log/download?batchNumber='+contents[i].batchNumber+'" download="'+contents[i].batchNumber+'.zip"><i class="layui-icon">&#xe655;</i></a>' +
                            '</td></tr>';
                    }else{
                        list += '<td class="td-manage"> <a title="修改" onclick="updatePlanCount('+contents[i].batchNumber+',\''+contents[i].corpId+'\')" href="javascript:;"> <i class="layui-icon">&#xe642;</i></a>' +
                            '</td></tr>';
                    }
                }
                $('#planMangeList').html(list);
            } else {
                totalCounts = 0;
                $('#planMangeList').html('');
            }
            paging(totalCounts);
        },complete: function () {
            layer.close(loadingIndex);
        }

    });
}

function updatePlanCount(planId,corpId) {
    x_admin_show('取数计划修改','../../html/planMange/planMange-edit.html?planId='+planId+"&corpId="+corpId+"&isUpdate=1",700,500);
}

function viewPlanCount(planId, obj) {
    $(obj).css('color','#99CCFF');
    x_admin_show('取数计划详细','../../html/planMange/planMange-view.html?planId='+planId,900,600);
}

//分野
function paging(total) {
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage.render({
            elem : 'pageDiv'
            ,count : total
            ,limit : 10
            ,curr : pageIndex
            ,jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                pageIndex = obj.curr;
                //首次不执行
                if(!first){
                    planList('asc')
                }
            }
        });
    });
    $('#totalNum').text('共有数据：'+total+' 条');
}


function findQuery() {
    //获取融资列表信息
    planList('asc');
    //分页
    paging(totalCounts);
}

//显示新增页面
function addPlan(event) {
    var isSelected = $('input[name="tdChecked"]:checked').val();
    if (isSelected == 'undefined' || isSelected == null || isSelected == '') {
        //alert("请选择一条企业数据");
        layer.msg("请选择一条企业数据",{icon:1,time:2000});
        return;
    }
    //获取页面的corpId
    var corpId = '';
    var planId = '';
    $('input[name="tdChecked"]:checked').each(function () {
        var tr = $(this).closest('tr'), tds = tr.find('td');
        planId = tds.eq(1).text();
        corpId = tds.eq(2).text();
    });
    x_admin_show('取数计划添加','../../html/planMange/planMange-edit.html?corpId='+corpId+"&planId="+planId+"&isUpdate=0",700,500);
}

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function initPage(icon, msg) {
    layer.msg(msg,{icon:icon,time:2000});
    planList('asc');
}




