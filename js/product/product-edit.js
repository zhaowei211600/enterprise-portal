var form = null,
    layer = null,
    element = null;

var fileNameList = '';
var success=0;
var fail=0;
$(function () {
    layui.use(['form', 'layer','upload'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element, upload = layui.upload;
        initialPage(form);

        form.on('submit(product)', function(data){
            var id = $("#id").val();
            var budget = $("#budget").val();
            var productName = $("#productName").val();
            var expectDeliveryTime = $("#expectDeliveryTime").val();
            var periodStart = $("#periodStart").val();
            var periodEnd = $("#periodEnd").val();

            var desc = $("#desc").val();
            //2019-05-08 新增
            var type = $("#type").val();
            var attr = $("#attr").val();
            var detail = $("#detail").val();
            var costType = $("#costType").val();
            var fileNameList = $("#fileNameList").val();

            var params = {'id': id, 'name': productName,
                'budget': budget, 'expectDeliveryTime': expectDeliveryTime,
                'periodStart': periodStart, 'desc':desc,'periodEnd': periodEnd,
                'type':type, 'attr':attr,
                'detail':detail,
                'costType':costType,
                'fileNameList': fileNameList};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/product/save",
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
                        layer.msg(resultData.returnMessage, {icon: 5, time:3000});
                    }
                },
                complete: function () {
                    layer.close(loadingIndex);
                }
            });
        });

        upload.render({
            elem : ('#uploadAttachment'),
            url :  baseUrl + "/user/file/attachment?",
            accept : 'file',
            multiple: true,
            processData: false,
            contentType: false,
            crossDomain: true == !(document.all),
            number:20,
//			MultipartFile file 对应，layui默认就是file,要改动则相应改动
            field:'file',
            bindAction: '#test9',
            before: function(obj) {
                var productId = $("#id").val()||0;
                this.data={'productId':productId};//关键代码
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result) {
                    //$('#fileList').append('<tr><td>'+file.name+'</td><td onclick="deleteAttachment('+file.name+')">删除</td></tr>')
                });
            },
            done: function(res, index, upload) {
                //每个图片上传结束的回调，成功的话，就把新图片的名字保存起来，作为数据提交
                if(res.returnCode != "200"){
                    fail++;
                }else{
                    success++;
                    fileNameList = fileNameList +""+res.data.fileName+",";
                    $('#fileList').append("<tr><td>"+res.data.originalName+"</td><td><a href=' ' onclick='deleteAttachment(this,\""+res.data.fileName+"\")\'>删除</a ></td></tr>")
                    $('#fileNameList').val(fileNameList);
                }
            },
            allDone:function(obj){
                layer.msg("总共要上传文件总数为："+(fail+success)+"\n"
                    +"其中上传成功文件数为："+success+"\n"
                    +"其中上传失败文件数为："+fail
                )
                success = 0;
                fail = 0;
            }
        });
    });

});

function initialPage(form) {
    var page_type = getUrlParam('type');
    var title = '添加';
    if(page_type && page_type == 1) {
        title = '编辑';
        displayProduct(getUrlParam('productId'), form);
    }else {
        $("#id").val('0');
    }
    $('#submitBtn').text(title);
}
/**
 * 编辑前回显
 * @param id
 */
function displayProduct(id, form) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/product/findById?id=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var menu = resultData.data;
                $("#id").val(menu.id);
                $("#name").val(menu.name);
                $("#url").val(menu.url);
                $("#order").val(menu.order);
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

function deleteAttachment(row,filePath) {
    $.ajax({
        url: baseUrl + "/operation/product/file/disable?filePath="+ filePath ,
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var i = row.parentNode.parentNode.rowIndex;
                document.getElementById('fileList').deleteRow(i);
            }
        }
    });
}
