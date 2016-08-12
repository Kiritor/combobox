;
(function($) {


    $.fn.combobox = function(options, param) {
        var methods = $.fn.combobox.methods;
        if (typeof options == 'string') {
            var method = methods[options];
            if (method){
                return method(this, param);
            }
        } else
          return methods["init"](this, options);

    };

    //插件初始化方法
    function init(target, options) {
        var $this = $(target);
        var settings = $.extend({}, $.fn.combobox.defaults, options);
        var prefixText = settings.prefixText;
        var $placeholder = "<span class='placeholder'>" + prefixText + "</span>";
        var $ul = "<ul></ul>";
        $this.append($placeholder);
        $this.append($ul);
        $this.on('click', '.placeholder', function(e) {
            var parent = $(this).closest('.combobox');
            if (!parent.hasClass('is-open')) {
                parent.addClass('is-open');
                $('.combobox.is-open').not(parent).removeClass('is-open');
            } else {
                parent.removeClass('is-open');
            }
            e.stopPropagation();
        }).on('click', 'ul>li', function() {
            var parent = $(this).closest('.combobox');
            parent.removeClass('is-open').find('.placeholder').text($(this).text());
        });
        $this.find("ul").on('mouseleave',function(){
            $('.combobox.is-open').removeClass('is-open');
        });

        $this.find("ul").css("height",settings.panelHeight);
        //保存数据
        $.data(target,"options",$.extend({}, settings));
        loadData(target,settings.data);
    }

    //加载数据
    function loadData(target,data) {
        var $this = $(target);
        var settings = $this.data("options");
        var temp = "";
        if(!data)
            return;
        //清空数据
        $this.find("ul").empty();
        for(var i=0;i<data.length;i++){
            temp = temp+ "<li>"+data[i][settings.textField] +"</li>";
            if(data[i]["selected"]){
                $this.find(".placeholder").text(data[i][settings.textField]);
                $.fn.combobox.defaults.id = data[i][settings.valueField];
                $.fn.combobox.defaults.text = data[i][settings.textField];
            }
        }
        $this.find("ul").append(temp);
        $.data(target,"options").onLoadSuccess.call(target,data);   //触发事件

    }

    //插件默认参数
    $.fn.combobox.defaults = {
        id:'',
        text:'',
        prefixText: '请选择',               //提示信息
        valueField: 'value',               //value
        textField: 'text',                 //界面显示
        panelHeight: 'auto',               //下拉框高度,默认auto
        mode: 'local', // or 'remote'      //本地OR远程数据
        method: 'post',
        url: null,                         //远程ajax访问地址
        data: null,                        //本地数据


        //事件
        onLoadSuccess:function(data){

        }
    }

    //插件方法
    $.fn.combobox.methods = {
        //初始化方法
        init: function(jq, options) {
            return jq.each(function() {
                init(this, options);
            });
        },
        loadData:function(jq,data){
            return jq.each(function(){
               loadData(this,data);
            });
        }
    }

})(jQuery);
