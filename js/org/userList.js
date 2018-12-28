//var curPage = 1;
var pageSize = 10;
var pages = 1;
var total = 0;

layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element;
    getOrgUserList(null);
    initOrgTree();
});

function getOrgUserList(curPage) {
    curPage = isInteger(curPage) ? curPage : 1;
    var userName = $('#userName').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var beginDate = $('#beginDate').val();
    var endDate = $('#endDate').val();
    if(beginDate != ''){
        beginDate = beginDate + ' 00:00:00';
    }
    if(endDate != ''){
        endDate = endDate + ' 23:59:59';
    }
    var state = $("#state").val();
    var orgNo = $("#orgNo").val();
    var simpleOrgName = $("#simpleOrgName").val();

    //提交表单 时调用的发方法
    var param = {};
    param["name"] = userName;
    param["email"] = email;
    param["phone"] = phone;
    param["beginDate"] = beginDate;
    param["endDate"] = endDate;
    param["state"] = 4;
    param["pageNum"] = curPage;
    param["pageSize"] = pageSize;
    if(simpleOrgName != ''){
        param["orgNo"] = orgNo;
    }
    var loadingIndex = layer.load(1);
    $.ajax({
        type: "post",
        data: JSON.stringify(param),
        url: baseUrl +"/orgUser/list",
        contentType:'application/json;charset=utf-8',
        async: false,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);},
        success: function (data) {
            if(data.returnCode == '200'){
                pages = data.data.pages;
                total = data.data.total;
                var list = data.data.list || {};
                var tbody='';
                for(var i=0; i<list.length; i++){
                    var content = list[i];
                    var updateTime = content.updateTime || '';
                    var auditTime = content.auditTime || '';
                    tbody += "<tr>";
                    tbody += "<td>"+(i+1)+"</td>";
                    tbody += "<td>"+content.name+"</td>";
                    tbody += "<td>" +content.orgName + "</td>";
                    tbody += "<td>"+content.phone+"</td>";
                    tbody += "<td>"+content.email+"</td>";
                    tbody += "<td>"+updateTime+"</td>";
                    tbody += "<td>"+auditTime+"</td>";
                    tbody += "<td class=\"td-manage\">" +
                        "<a title=\"详情\"  onclick=\"x_admin_show('详情','./detail.html?id="+ content.id +"',800,550,)\" href=\"javascript:;\">\n" +
                        "<i class=\"layui-icon\">&#xe642;</i></a>";
                    tbody += "</tr>";
                }
                $('#userList').html(tbody);
            }else{
                total = 0;
                $('#userList').html("");
            }
            paging(total,curPage);

        },complete: function () {
            layer.close(loadingIndex);
        }
    });


}

function paging(total,curPage) {
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage.render({
            elem : 'userPageDiv'
            ,count : total
            ,limit : 10
            ,curr : curPage
            ,jump: function(obj, first){
                curPage = obj.curr;
                //首次不执行
                if(!first){
                    getOrgUserList(curPage)
                }
            }
        });
    });
}
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

/**
 * 机构树点击事件
 */
function orgTreeOnClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("orgTree");
    nodes = zTree.getSelectedNodes();
    console.log(JSON.stringify(nodes));
    $("#simpleOrgName").val(nodes[0].name);
    $("#orgNo").val(nodes[0].orgNo);
}


/**
 * 初始化机构树
 */
function initOrgTree() {
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