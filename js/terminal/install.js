//var curPage = 1;
var pageSize = 10;
var pages = 1;
var total = 0;

layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element;

    getInstallList(null);
    initOrgTree();
});
function getInstallList(curPage) {
    curPage = isInteger(curPage) ? curPage : 1;
    var corpName = $("#corpName").val();
    var simpleOrgName = $("#simpleOrgName").val();
    var orgNo = $('#orgNo').val();
    var taxNo = $('#taxNo').val();
    var beginDate = $('#beginDate').val();
    var salesTaxNo = $('#salesTaxNo').val();
    if(beginDate != ''){
        beginDate = beginDate + ' 00:00:00';
    }
    var endDate = $('#endDate').val();
    if(endDate != ''){
        endDate = endDate + ' 23:59:59';
    }


    var param = {};
    param["corpName"] = corpName;
    param["taxNo"] = taxNo;
    param["salesTaxNo"] = salesTaxNo;
    param["beginDate"] = beginDate;
    param["endDate"] = endDate;
    param["pageIndex"] = curPage;
    param["pageSize"] = pageSize;
    if(simpleOrgName != ''){
        param["orgNo"] = orgNo;
    }
    var loadingIndex = layer.load(1);
    $.ajax({
        type: "post",
        data: JSON.stringify(param),
        url: baseUrl +"/fipOperaOutput/terminal/install/log",
        dataType:"json",
        contentType:'application/json;charset=utf-8',
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success: function (resultData) {
            if(resultData.returnCode == '200'){
                pages = resultData.data.pages;
                total = resultData.data.total;
                var list = resultData.data.list || {};
                var tbody='';
                for(var i=0; i<list.length; i++){
                    var content = list[i];
                    var hasOutputInvoice;
                    if(content.hasOutputInvoice == true){
                        hasOutputInvoice = '有';
                    }else{
                        hasOutputInvoice = '无';
                    }
                    var orgName = content.orgName||'';
                    var invoiceTaxNos = content.invoiceTaxNos;
                    if(invoiceTaxNos != '' && invoiceTaxNos.length > 40){
                        invoiceTaxNos = invoiceTaxNos.substring(0,40) + '...';
                    }
                    tbody += "<tr>";
                    tbody += "<td>"+(i+1)+"</td>";
                    tbody += "<td>"+content.corpName+"</td>";
                    tbody += "<td>"+content.taxNo+"</td>";
                    tbody += "<td>"+ invoiceTaxNos +"</td>";
                    tbody += "<td>"+content.createTime+"</td>";
                    tbody += "<td>"+hasOutputInvoice+"</td>";
                    tbody += "<td>"+ orgName +"</td>";
                    tbody += "<td class=\"td-manage\">" +
                        "<a title=\"编辑\"  onclick=\"x_admin_show('详情','./detail.html?taxNo="+ content.taxNo +"',800,550,)\" href=\"javascript:;\">\n" +
                        "<i class=\"layui-icon\">&#xe642;</i></a>";
                    tbody += "</tr>";
                }
                $('#installList').html(tbody);
            }else{
                total = 0;
                $('#installList').html("");
            }
            paging(total,curPage);
        },
        complete: function () {
        layer.close(loadingIndex);
    }
    });
}

function paging(total,curPage) {
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage.render({
            elem : 'installPageDiv'
            ,count : total
            ,limit : 10
            ,curr : curPage
            ,jump: function(obj, first){
                curPage = obj.curr;
                //首次不执行
                if(!first){
                    getInstallList(curPage)
                }
            }
        });
    });
}

//机构下拉搜索
/**
 * 初始化机构树
 */
function initOrgTree() {
    var zTree;

    var setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        data: {
            key: {
                children: "children",
                name: "name"
            },
            simpleData: {
                enable:true,
                idKey:"orgNo",
                pIdKey: "parentOrgNo"
            }
        },
        callback: {
            onClick: orgTreeOnClick
        }
    };

    $.ajax({
        type: "post",
        url: baseUrl + "/fipOperaOrg/org/tree",
        data:{"parentOrgNo":"0"},
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success: function (data) {
            if(data.returnCode == '200'){
                //生成机构树
                $.fn.zTree.init($("#orgTree"), setting, data.data);
            }
        }
    });
}

/**
 * 机构树点击事件
 */
function orgTreeOnClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("orgTree");
    nodes = zTree.getSelectedNodes();
    $("#simpleOrgName").val(nodes[0].name);
    $("#orgNo").val(nodes[0].orgNo);
}

/**
 * 显示机构树
 */
function showOrgTree(){
    var deptObj = $("#simpleOrgName");
    $("#orgContent").css({background:"white"}).slideDown("fast");
    $('#orgTree').css({width:deptObj.outerWidth() - 12 + "px",height:"300px"});
    $("body").bind("mousedown", onBodyDownByOrgTree);
}


/**
 * Body鼠标按下事件回调函数
 */
function onBodyDownByOrgTree(event) {
    if(event.target.id.indexOf('switch') == -1){
        hideOrgTree();
    }
}
/**
 * 隐藏机构树
 */
function hideOrgTree() {
    $("#orgContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDownByOrgTree);
}

function isInteger(obj) {
    return typeof obj === 'number' && obj%1 === 0
}