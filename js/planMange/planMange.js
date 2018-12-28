var token = localStorage.getItem('OperaAuthorization');
var tokenString = 'Bearer ' + token;

var sing = "";

var form = null,layer = null,element = null;
layui.use(['layer', 'form', 'element'], function(){
    layer = layui.layer
    form = layui.form
    element = layui.element;
    var planId = getUrlParam("planId");
    var isUpdate = getUrlParam("isUpdate");
    var corpId = getUrlParam("corpId");

    var param = {planId:planId,corpId:corpId};
    if ('1' == isUpdate) {
        planDetailFun(param);
    }else {
        planAddFun(planId,corpId);
    }
});

//页面参数传递
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function planAddFun(planId,corpId) {
    var loadingIndex = layer.load(1);
    $("#corpId").val(corpId);
    $('#updatePlanId').val('');
    $('#updatePlanId').val(planId);
    sing = "添加";
    $.ajax({
        type:"post",
        url:baseUrl + "/fipOperaPlan/auditingFetchPlan/getCorpNameById?corpId="+corpId+"",
        async:false,
        dataType: 'json',
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success:function(resultData){
            if (resultData.returnCode == 200) {
                var data = resultData.data ||{};
                if (data.length>0) {
                    $("#corpName").val(data);
                }else{
                    layer.msg("返回数据失败",{icon:5,time:2000});
                }
            } else{
                //alert('返回数据失败');
                layer.msg("返回数据失败",{icon:1,time:2000});
            }

        },complete: function () {
            layer.close(loadingIndex);
        }

    });
}

function planDetailFun(param) {
    var loadingIndex = layer.load(1);
    sing = "修改";
    var corpId = param.corpId;
    $("#corpId").val(corpId);
    $('#updatePlanId').val(param.planId);
    $.ajax({
        type:"post",
        url:baseUrl + "/fipOperaPlan/auditingFetchPlan/getCorpNameById?corpId="+corpId+"",
        async:false,
        dataType: 'json',
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success:function(resultData){
            if (resultData.returnCode == 200) {
                var data = resultData.data ||{};
                if (data.length>0) {
                    $("#corpName").val(data);
                }else{
                    layer.msg("返回数据失败",{icon:5,time:2000});
                }
                //回填别的数据
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
                            $('#startTimeAdd').val(data.startTime);
                            $('#endTimeAdd').val(data.endTime);
                            var planType = data.planType ;
                            var fetchType = data.fetchType ;
                            $("#planTypeAdd").val(planType)
                            $("#fetchTypeAdd").val(fetchType);
                            renderForm();
                        }else{
                            layer.msg(resultData.returnMessage,{icon:1,time:200});
                        }
                    }});
            } else{
                //alert('返回数据失败');
                layer.msg("返回数据失败",{icon:1,time:2000});
            }

        },complete: function () {
            layer.close(loadingIndex);
        }

    });

}

function renderForm(){
    layui.use('form', function(){
        var form = layui.form;
        form.render();
    });
}

function addDetial(){
    var loadingIndex = layer.load(1);
    var corpIdAdd = $("#corpId").val();
    var planTypeAdd = $(".planTypeAddSelect option:selected").val();

    var startTimeAdd = $("#startTimeAdd").val();
    var endTimeAdd = $("#endTimeAdd").val();

    if (startTimeAdd.length == 0 || endTimeAdd.length == 0) {
        layer.msg("开始时间，结束时间，都不能为空",{icon:2,time:2000});
        return;
    }
    var param = {
        'startTime':startTimeAdd,
        'endTime':endTimeAdd,
        'corpId':corpIdAdd,
        'type':planTypeAdd
    };
    var url = baseUrl + "/fipOperaPlan/auditingFetchPlan/createOperationPlan";
    if('修改' == sing){
        url = baseUrl + "/fipOperaPlan/auditingFetchPlan/updateOperationPlan";
        param.planId = $("#updatePlanId").val();
        param.fetchType = $(".fetchTypeAddSelect option:selected").val();
    }

    $.ajax({
        type:"post",
        url: url,
        async:true,
        data:param,
        dataType: 'json',
        async:false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success:function(resultData){
            if (resultData.returnCode == 200) {
                x_admin_close();
                parent.initPage(1, resultData.returnMessage);
            } else{
                //alert(resultData.returnMessage);
                layer.msg(resultData.returnMessage,{icon:1,time:2000});
            }

        },complete: function () {
            layer.close(loadingIndex);
        }

    });
}
