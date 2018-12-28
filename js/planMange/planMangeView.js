var token = localStorage.getItem('OperaAuthorization');
var tokenString = 'Bearer ' + token;

var sing = "";
var form = null,layer = null,element = null;
$(document).ready(function (){
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        form.render();
        var planId = getUrlParam("planId");
        applyCode(planId);
    });

});

//页面参数传递
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//详情
function applyCode(planId){
    var loadingIndex = layer.load(1);
    var param = {planId:planId};
    $.ajax({
        type:"post",
        url:baseUrl + "/fipOperaPlan/auditingFetchPlan/findPlan",
        async:true,
        data:param,
        //contentType:'application/json;charset=utf-8',
        dataType: 'json',
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success:function(resultData){
            if (resultData.returnCode == 200) {
                var data = resultData.data ||{};
                var fetchType = Number(data.fetchType);
                var planType = Number(data.planType);
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
                var taxNosStr = '';
                for(var i=0,len = data.taxNos.length;i < len;i++){
                    taxNosStr += data.taxNos[i] + ",";
                }

                $('#batchNo').val(data.batchNumber);
                $('#endTime').val(data.endTime);
                $('#startTime').val(data.startTime);
                $('#corpId').val(data.corpId );
                $('#planType').val(planTypeString);
                $('#finishType').val(statueString);
                $('#finishTime').val(data.finishTime == null ? '' : data.finishTime);
                $('#taxNos').val(taxNosStr);
            } else{
                //alert('返回数据失败');
                layer.msg("返回数据失败",{icon:1,time:2000});
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            }
        },complete: function () {
            layer.close(loadingIndex);
        }

    });
}



