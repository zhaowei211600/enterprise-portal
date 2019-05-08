function isInteger(obj) {
    return typeof obj === 'number' && obj%1 === 0
}

/**
 * 分页函数--暂不支持【含参数】列表查询主函数
 * 默认每页10条数据
 * @param page_elem_id (分页组件-DOM对象的ID属性,[字符串])
 * @param total(总条数，[正整数]，如：3；反例：'3')
 * @param cur_page(当前页码，[正整数]，如：3；反例：'3')
 * @param show_total_elem_id(显示总条数的DOM对象ID属性,[字符串])
 * @param fn(列表查询主函数名称，用于回调刷新列表，[字符串])
 */
function paging(page_elem_id, total, cur_page, show_total_elem_id, fn) {
    if(!isInteger(total) || !isInteger(cur_page)) return false;
    if (fn == null || fn == undefined || fn == '') return false;
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage.render({
            elem :page_elem_id
            ,count : total
            ,limit : 10
            ,curr : cur_page
            ,jump : function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                //首次不执行
                if(!first){
                    eval(fn+"(" + obj.curr + ")");
                }
            }
        });
    });
    if (show_total_elem_id !== null || show_total_elem_id !== undefined || show_total_elem_id !== '')
        $('#' + show_total_elem_id).text('共有数据：'+total+' 条');
}