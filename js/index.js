var jeorjym=true;
$(document).ready(function (e) {
    

    function switchje(num) {
        if (num == 1 || num == 3) {
            jeorjym=true;
            $("#Invoice-checkcode").hide();
            $("#Invoice-Amount").show();
        } else if (num == 2) {
            jeorjym=false;
            $("#Invoice-checkcode").show();
            $("#Invoice-Amount").hide();
            $("#Invoice-Amount").val("");
        }

    }
    $(function () {
        $("#Invoice-checkcode").hide();
        $("#Invoice-code").blur(function () {
            var codeList = $(this).val().split("");
            if (codeList.length == 10) {
                if (codeList[7] == 1 || codeList[7] == 2 || codeList[7] == 5 || codeList[7] == 7) {
                    switchje(1);
                } else if (codeList[7] == 3 || codeList[7] == 6) {
                    switchje(2);
                } else {
                    switchje(3);
                }
            } else if (codeList.length == 12) {
                if (codeList[0] == 0 && (codeList[10] == 1 || codeList[10] == 6 || codeList[11] == 1 || codeList[11] == 7)) {
                    switchje(2);
                } else if (codeList[0] == 1) {
                    switchje(1);
                } else {
                    switchje(3);
                }
            }
        })
    });


    
    
    function limitNumsOfAmount(obj){
        var invoiceAmount = $.trim($(obj).val());
        var length = invoiceAmount.length;
        if(invoiceAmount.length>10){
            var rep=/[\.]/;
            var reg1=/^[-]/;
            if(!reg1.test(invoiceAmount)&&(!rep.test(invoiceAmount))){
                invoiceAmount=invoiceAmount.substr(0,10);
            }else if(reg1.test(invoiceAmount)&&(!rep.test(invoiceAmount))){
                invoiceAmount=invoiceAmount.substr(0,11);
            };
        }
        var pointNum = invoiceAmount.split(".")[1];
        if(pointNum){
            pointNum =  pointNum.substr(0,2);
            invoiceAmount = invoiceAmount.split(".")[0]+"."+pointNum;
        }
        $(obj).val(invoiceAmount);
        return invoiceAmount;
    }
    
    
    
//  $('#drfp-btn').click(function(){
//      var param =verifyValues();
//      $('#gjcg').show();
//      $('#tcpage').show();
//      setTimeout(function time(){
//          $('#gjcg').hide();
//          $('#tcpage').hide();
//          location.href = "myFinancing.html";
//      },3000);
//      if(param != false){
//          $.ajax({
//              url:"",
//              type:"post",
//              dataType:"json",
//              contentType: "application/json;charset=utf-8",
//              data:JSON.stringify(param),
//              async: true,
//              success:function(data){
//                  alert("成功");
//                  
//              },
//              error:function(){
//                  alert("失败");
//              }
//          });
//      }
//  });
    
    
    $('#show-password').click(function(){
        if($('#regist-pwtxt').attr('type') == 'password'){
            $('#regist-pwtxt').attr('type','text');
        }else{
            $('#regist-pwtxt').attr('type','password');
        }
    });
    
    
    
    
    
    
    
    
    
    

})
function verifyValues() {
        var invoiceCode = $.trim($("#Invoice-code").val()),
            invoiceNumber = $.trim($("#Invoice-number").val()),
            issueDate = $.trim($("#issueDate").val()),
            invoiceAmount = $("#Invoice-Amount").val(),
            invoiceCheckcode = $("#Invoice-checkcode").val();
        //发票代码验证
        if (invoiceCode == "") {
            result = "请填写由数字组成的发票代码!";
            $('#gjcg').show();
            $('#gjcg').find('.modal-body').html(result);
            $('#gjcg').find('.modal-footer').show();
            return false;
        }
        var reg = /^\d{10}$/,
            reg2 = /^\d{12}$/;
        if ((!reg.test(invoiceCode)) && (!reg2.test(invoiceCode))) {
            result = "请输入10位或12位数字的发票代码!";
            alert(result);
            return false;
        }
        //发票号码验证
        if (invoiceNumber == "") {
            result = "请填写由数字组成的发票号码!";
            alert(result);
            return false;
        }
        reg = /^\d{8}$/;
        if (!reg.test(invoiceNumber)) {
            result = "请输入8位数字的发票号码!";
            alert(result);
            return false;
        }
        //发票日期验证
        if (!issueDate) {
            result = "发票日期不能为空!";
            alert(result);
            return false;
        }
        reg = /^[1-2]{1}\d{3}-(\d{1}|0\d|1[0-2])-(\d|[0-2]\d|3[0-1])$/;
        if (!reg.test(issueDate)) {
            result = "请输入正确的发票日期(YYYY-MM-DD)!";
            alert(result);
            return false;
        }
        //发票金额验证
        if (jeorjym) {
            //发票金额验证
            if (invoiceAmount =="") {
                result = "请填写发票金额!";
                alert(result);
                return false;
            }
            reg = /^([+-]?)((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/
            if (!reg.test(invoiceAmount)) {
                result = "请输入正确的发票金额!";
                alert(result);
                return false;
            }
        } else {
            if (invoiceCheckcode == "") {
                result = "请填写校验码!";
                alert(result);
                return false;
            }
            reg = /^\d{6}$/
            if (!reg.test(invoiceCheckcode)) {
                result = "请输6位数字校验码!";
                alert(result);
                return false;
            }
        }
        //window.location.href="Inspection-results.html"
        return {
            "InvoiceCode": invoiceCode,
            "InvoiceNumber": invoiceNumber,
            "BillingDate": issueDate,
            "TotalAmount": invoiceAmount,
            "CheckCode_6": invoiceCheckcode
        };
    };