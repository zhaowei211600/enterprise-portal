var form = null,
    layer = null,
    element = null,
    upload = null;

var success=0;
var fail=0;
var productId = null;

$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element , upload = layui.upload;
        initialPage(form);

    });
});

function initialPage(form) {
    var productId = getUrlParam('productId');
    displayProduct(getUrlParam('productId'), form);
    listFile(productId);
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
                $("#productName").val(product.name);
                $("#budget").val(product.budget);
                $("#period").val(product.period);
                $("#desc").val(product.desc);
                $("#detail").val(product.detail);
                $("#expectDeliveryTime").val(product.expectDeliveryTime);
                $('#type').val(product.type);
                $('#attr').val(product.attr);
                $('#costType').val(product.costType);
                form.render();
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}


function listFile(productId) {
    $.ajax({
        url: baseUrl + "/operation/product/file/list?productId="+ productId ,
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                if(list.length > 0){
                    var tbody = '';
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        tbody += "<tr>";
                        tbody += "<td>"+ content.fileName +"</td>";
                        tbody += "</tr>";
                    }
                    $('#fileList').append(tbody);
                }
            }
        }
    });
}


