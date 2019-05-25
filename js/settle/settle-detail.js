var form = null,
    layer = null,
    element = null,
    pageNum=1,
    total=0;
var productId, status, orderId;
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
    /*layui.use('laypage', function(){
        var laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: pageNum //数据总数，从服务端得到
            ,limit:10//每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            ,jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                pageNum = obj.curr;
                getProductList(productId,pageNum)
                //首次不执行
                if(!first){
                    //do something
                }
            }
        });


    });*/

});


function initialPage(form) {
    productId = getUrlParam('productId');
    orderId = getUrlParam('productId')
    if(productId != 0) {
        displayProduct(form);
        getProductList(pageNum)
    }else {
        $("#id").val('0');
    }
}
/**
 * 编辑前回显
 * @param id
 */
function displayProduct(form) {
    if(!productId || '' == productId) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/product/find?productId=" + productId,
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
function getProductList(cur_page) {
    var total = 0;
    cur_page = isInteger(cur_page) ? cur_page : 1;
    if(!productId || '' == productId) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/check/settle/list",
        data:JSON.stringify({
            "pageNum":cur_page,
            "pageSize":"10",
            "orderId":orderId
        }),
        type: "post",
        contentType: 'application/json;charset=UTF-8',
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var tbody = '',status;
                total = resultData.total;
                var product = resultData.data;
                $('#waitCheckList tr').remove()
                for (var i = 0; i < product.length; i++){
                    var item = product[i];
                    var auditor = '';
                    if(item.auditor !=null && item.auditor != ''){
                        auditor = item.auditor
                    }
                    tbody +='<tr>\n'
                    tbody +=   '<td>'+item.realName+'</td>\n'
                    tbody +=   '<td>'+item.phone+'</td>\n'
                    tbody +=   '<td>'+item.updateTime+'</td>\n'
                    tbody +=   '<td>'+ auditor +'</td>\n'
                    tbody +=   '<td>'+item.updateTime+'</td>\n'
                    if(item.status == '4'){
                        tbody +=    '<td>已结算</td>\n'
                        tbody +=    '<td> -- </td>\n'
                    }else if (item.status == '2'){
                        tbody +=    '<td>待结算</td>\n'
                        tbody +=    '<td><a onclick="x_admin_show(\'项目结算\',\'./settle-detail-confirm.html?id='+item.id+'\',400,180)">结算</a></td>\n'

                    }
                    tbody +=    '</tr>'
                }
                $('#waitCheckList').append(tbody)
            }
            paging('page', total, cur_page, 'totalNum', 'getProductList');
            return false;
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
