;
(function($) {

    var id, text;

    $.fn.combobox = function(options, param) {
        var methods = $.fn.combobox.methods;
        if (typeof options == 'string') {
            var method = methods[options];
            if (method) {
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

            var selectedRecord = new Object();
            var flag = false;
            if (id != $(this).attr("value")) {
                flag = true;
            }
            var parent = $(this).closest('.combobox');
            if ($(this).attr("selected")&&settings.notNull==false) {
                //触发onUnSelect事件
                //取消选择选项
                text = "";
                id = "";
                selectedRecord[settings.valueField] = $(this).attr("value");
                selectedRecord[settings.textField] = $(this).text();;
                options.onUnSelect.call(target, selectedRecord);
                $(this).removeAttr("selected");
                parent.find('.placeholder').text(settings.prefixText);
            } else {
                //触发onSelect事件
                //保存当前选择选项
                text = $(this).text();
                id = $(this).attr("value");
                selectedRecord[settings.valueField] = id;
                selectedRecord[settings.textField] = text;
                options.onSelect.call(target, selectedRecord);
                $(this).attr("selected", true);
                parent.find('.placeholder').text($(this).text());
            }
            parent.removeClass('is-open');
            if (flag)
                options.onChange.call(target, $(this).attr("value"), id);

        });
        $this.find("ul").on('mouseleave', function() {
            $('.combobox.is-open').removeClass('is-open');
        });

        $this.find("ul").css("height", settings.panelHeight);
        $this.css("width", settings.width);
        //保存设置数据
        $.data(target, "options", $.extend({}, settings));
        loadData(target, settings.data);
    }

    //加载数据
    function loadData(target, data) {
        var $this = $(target);
        var settings = $this.data("options");
        var temp = "";
        if (!data)
            return;
        //清空数据
        $this.find("ul").empty();
        for (var i = 0; i < data.length; i++) {
            var select = "";
            if (data[i]["selected"]) {
                select = "selected='" + data[i]["selected"] + "'";
            }
            temp = temp + "<li value='" + data[i][settings.valueField] + "'" + select + ">" + data[i][settings.textField] + "</li>";
            if (data[i]["selected"]) {
                $this.find(".placeholder").text(data[i][settings.textField]);
                id = data[i][settings.valueField];
                text = data[i][settings.textField];
            }
        }
        $this.find("ul").append(temp);
        $.data(target, "options").onLoadSuccess.call(target, data); //触发事件

    }
    //get Value
    function getValue() {
        return id;
    }

    //get text
    function getText() {
        return text;
    }

    //插件默认参数
    $.fn.combobox.defaults = {
        prefixText: '请选择', //提示信息
        valueField: 'value', //value
        textField: 'text', //界面显示
        panelHeight: 'auto', //下拉框高度,默认auto
        notNull:'true',      //是否为空(默认不为空,需要选择一项)
        width: 'auto',
        mode: 'local', // or 'remote'      //本地OR远程数据
        method: 'post',
        url: null, //远程ajax访问地址
        data: null, //本地数据


        //事件
        onLoadSuccess: function(data) {

        },
        onChange: function(newValue, oldValue) {

        },
        onSelect: function(record) {

        },
        onUnSelect: function(record) {

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
        loadData: function(jq, data) {
            return jq.each(function() {
                loadData(this, data);
            });
        },
        getValue: function() {
            return getValue();
        },
        getText: function() {
            return getText();
        }
    }

})(jQuery);
