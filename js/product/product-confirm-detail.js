var form = null,
    layer = null,
    element = null,
    pageNum=1,
    pageNumH=1,
    total=0,
    totalH=0;
var productId, status;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element;
        initialPage(form);

        form.on('submit(product)', function(data){
            var id = $("#id").val();
            var checkDesc = $("#checkDesc").val();
            var realCost = $("#realCost").val();
            var params = {'productId': id, 'checkDesc': checkDesc, 'realCost': realCost};
            if(status == '4'){
                layer.msg("当前项目已结项", {icon: 5, time:3000});
            }
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/product/check",
                type: "post",
                data: params,
                beforeSend: function (request) {
                    request.setRequestHeader("OperaAuthorization", TOKEN);
                },
                success: function (resultData) {
                    if (resultData.returnCode == 200) {
                        x_admin_close();
                        parent.initPage(1, resultData.returnMessage);
                    } else {
                        layer.msg(resultData.data, {icon: 5, time:3000});
                    }
                },
                complete: function () {
                    layer.close(loadingIndex);
                }
            });
        });
    });
    layui.use('laypage', function(){
        var laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'page1' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: pageNum //数据总数，从服务端得到
            ,limit:10//每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            ,jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                pageNum = obj.curr;
                getWaitCheckList(productId,pageNum)
                //首次不执行
                if(!first){
                    //do something
                }
            }
        });
        laypage.render({
            elem: 'page2' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: pageNumH //数据总数，从服务端得到
            ,limit:10//每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            ,jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                pageNumH = obj.curr;
                getCheckHistoryList(productId,pageNumH)
                //首次不执行
                if(!first){
                    //do something
                }
            }
        });
    });

});


function initialPage(form) {
    productId = getUrlParam('productId');
    if(productId != 0) {
        displayProduct(productId , form);
        getWaitCheckList(productId,pageNum)
        getCheckHistoryList(productId,pageNumH)
    }else {
        $("#id").val('0');
    }
}
/**
 * 编辑前回显
 * @param id
 */
function displayProduct(id, form) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/product/find?productId=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var product = resultData.data;
                status = product.status;
                $("#productId").val(product.productId);
                $("#name").val(product.name);
                $("#budget").val(product.budget);
                $("#serviceCost").val(product.serviceCost);
                $("#period").val(product.period);
                $("#expectDeliveryTime").val(product.expectDeliveryTime);

                switch (product.type){
                    case '1':{
                        $('#type').val('咨询培训类')
                        break;
                    }
                    case '2':{
                        $('#type').val('技术开发类')
                        break;
                    }
                    case '3':{
                        $('#type').val('中介服务类 ')
                        break;
                    }
                    case '4':{
                        $('#type').val('设计创意类 ')
                        break;
                    }
                    case '5':{
                        $('#type').val('其他')
                        break;
                    }
                }
                if(product.attr == '1'){
                    $('#attr').val('持续性服务')
                }else {
                    $('#attr').val('一次性服务')
                }
                switch (product.costType){
                    case '1':{
                        $('#costType').val('按月')
                        break;
                    }
                    case '2':{
                        $('#costType').val('一次性')
                        break;
                    }
                    case '3':{
                        $('#costType').val('分阶段')
                        break;
                    }
                }

            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
function getWaitCheckList(id,pageNum) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/check/wait",
        data:JSON.stringify({
            "pageNum":pageNum,
            "pageSize":"10",
            "orderId": id
        }),
        type: "post",
        contentType: 'application/json;charset=UTF-8',
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var tbody = '',arr = [];
                if(total != resultData.total){
                    total = resultData.total;
                }

                var product = resultData.data;
                $('#waitCheckList tr').remove()
                for (var item of product){
                    var finishDesc = '';
                    if(item.finishDesc != null && item.finishDesc != ''){
                        finishDesc = item.finishDesc;
                    }
                    tbody +='<tr>\n' +
                        '            <td>'+item.realName+'</td>\n' +
                        '            <td>'+item.phone+'</td>\n' +
                        '            <td>'+item.updateTime+'</td>\n' +
                        '            <td>'+finishDesc+'</td>\n' +
                        '            <td><a onclick="x_admin_show(\'项目验收\',\'./product-confirm.html?id='+item.id+'&orderId='+item.orderId+'\',600,500)">确认验收</a></td>\n' +
                        '        </tr>'
                    arr.push({id:item.id,finishDesc:item.finishDesc})

                }
                localStorage.setItem('finishDesc',JSON.stringify(arr))
                $('#waitCheckList').append(tbody)

            }else{
                $('#waitCheckList tr').remove()
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
function getCheckHistoryList(id,pageNum) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/check/history",
        data:JSON.stringify({
            "pageNum":pageNum,
            "pageSize":"10",
            "orderId":id
        }),
        type: "post",
        contentType: 'application/json;charset=UTF-8',
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var tbody = '',status='';
                if(totalH != resultData.total){
                    totalH = resultData.total
                }

                var product = resultData.data;
                $('#checkHistoryList tr').remove()
                for (var item of product){
                    if(item.status == '2'){
                        status = '已验收'
                    }else if(item.status == '3'){
                        status='已拒绝'
                    }else if(item.status == '4'){
                        status='已结算'
                    }
                    tbody +='<tr>\n' +
                        '            <td>'+item.realName+'</td>\n' +
                        '            <td>'+item.phone+'</td>\n' +
                        '            <td>'+item.updateTime+'</td>\n' +
                        '            <td>'+item.auditor+'</td>\n' +
                        '            <td>'+item.updateTime+'</td>\n' +
                        '            <td>'+status+'</td>\n' +
                        '            <td><a onclick="x_admin_show(\'项目验收\',\'./product-detail.html?id='+item.id+'&orderId='+item.orderId+'\',600,540)">详情</a></td>\n' +
                        '        </tr>'
                }
                $('#checkHistoryList').append(tbody)

            }else{
                $('#checkHistoryList tr').remove()
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}