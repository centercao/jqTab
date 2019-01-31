/***使用说明*****
 * <div style="height: 500px" id="abcd"></div>
 * 初始化
 * var test =$("#abcd").JqTab();
 * 调用addTab
 *  $("#abcd").JqTab("addTab","test1.html","试验标签1",true); // true 不能关闭
 *  $("#abcd").JqTab("addTab","book01.html","试验标签2");
 ****************/

;(function ($) {
	var jqTab = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, jqTab.defaults, options);
		$(this.$element).empty();
		$(this.$element).addClass("jqTab ui-widget-content");
		$this = this;
		// 左角按钮
		var _tab = '\
		<div class="tabsHeader">\
			<div class="leftPanel" style="text-align: center">\
				<button style="bottom: 2px;height: 36px;" class="tabRollLeft ui-button ui-corner-all ui-widget ui-button-icon-only">\
				<span class="ui-button-icon ui-icon ui-icon-triangle-1-w"></span>\
				<span class="ui-button-icon-space"> </span>\
				Left roll button</button>\
			</div>\
			<ul class="tabsList ui-widget-header">\
			</ul>\
			<div class="rightPanel">\
				<button style="bottom: 2px;height: 36px;"  class="tabRollRight ui-button ui-corner-all ui-widget ui-button-icon-only">\
					<span class="ui-button-icon ui-icon ui-icon-triangle-1-e"></span>\
					<span class="ui-button-icon-space"> </span>Right roll button\
				</button>\
				<button style="position: absolute;width: 100px;height:36px;top:2px; 0;border: solid 2px #0a64b2;" class="tabsOpe ui-button ui-corner-all ui-widget">操作\
					<span class="ui-button-icon ui-icon ui-icon-triangle-1-s"></span>\
				</button>\
			</div>\
		</div>\
		<div class="tabContent">\
			<iframe class="LRADMS_iframe" scrolling = "auto" width="100%" height="100%" src="book01.html" frameborder="0" data-id="book01.html" seamless></iframe>\
			<iframe class="LRADMS_iframe" style="display: none" scrolling = "auto" width="100%" height="100%" src="test.html" frameborder="0" data-id="test.html" seamless></iframe>\
		</div>';
		$(this.$element).append(_tab);
		// 点击标签
		this.$element.find(' .tabsHeader ul.tabsList').on('click','li',function () {
			$(this).siblings('.ui-state-active').removeClass("ui-state-active");
			$(this).addClass("ui-state-active");
			$this.$element.find('.tabContent .LRADMS_iframe:visible').hide();
			$this.$element.find('.tabContent iframe[data-id="' +  $(this).data('id') + '"]').show();
			return false;
		});

		// 关闭标签
		this.$element.find('.tabsHeader ul.tabsList').on('click','li span',function () {
			var $parent = $(this).parent();
			$this.$element.find('.tabContent iframe[data-id="' +  $parent.data('id') + '"]').remove();
			if($parent.hasClass('ui-state-active')){
				var act = $parent.next();
				if(act.is(':visible')){
					act.addClass('ui-state-active');
					$this.$element.find('.tabContent iframe[data-id="' +  act.data('id') + '"]').show();
				}else {
					act = $parent.prev();
					if(act.length > 0) {
						act.addClass('ui-state-active');
						if(!act.is(':visible')){
							act.show("slide",{}, 500,function () {
							});
						}
						$this.$element.find('.tabContent iframe[data-id="' +  $(act).data('id') + '"]').show();
					}
				}
			}
			$parent.remove();
			if($this.$element.find('.tabsHeader ul.tabsList li:visible').length == 0){
				$this.$element.find( ".tabsHeader ul.tabsList li:hidden:last" ).show("slide",{}, 500,function () {
				});
			}
			return false;
		});
		// 点击向左边滚动
		this.$element.find('.tabsHeader .leftPanel .tabRollLeft').on('click',function () {
			var tabListWidth = $this.$element.find('.tabsHeader ul.tabsList').width();
			var tabVisible = $this.$element.find('.tabsHeader ul.tabsList li:visible');
			var tabVisibleWidth = private_methods.calSumWidth(tabVisible);
			if(tabVisibleWidth > tabListWidth){
				if($this.$element.find( ".tabsHeader ul.tabsList li:visible" ).length > 1){
					$this.$element.find( ".tabsHeader ul.tabsList li:visible:first" ).hide("slide",{}, 500,function () {
						// alert($(this).text());
					});
				}
			}
			return false;
		});
		// 点击向右边滚动
		this.$element.find('.tabsHeader .rightPanel  .tabRollRight').on('click',function () {
			var test = $this.$element.find( ".tabsHeader ul.tabsList li:hidden:last" );
			$this.$element.find( ".tabsHeader ul.tabsList li:hidden:last" ).show("slide",{}, 500,function () {
				// alert($(this).text());
			});
			return false;
		});
		//当浏览器大小变化时滚动标签
		$(window).resize(function () {
			var tabListWidth = $this.$element.find('.tabsHeader ul.tabsList').outerWidth(true);
			var tabVisible = $this.$element.find('.tabsHeader ul.tabsList li:visible');
			var tabVisibleWidth = private_methods.calSumWidth(tabVisible);
			if (tabVisibleWidth > tabListWidth) {
				$this.$element.find( ".tabsHeader ul.tabsList li:visible:first" ).hide();
			}
			if(!tabVisible.hasClass("ui-state-active")){
				$this.$element.find('.tabsHeader ul.tabsList li.ui-state-active').removeClass("ui-state-active");
				var tabVisibleLast = $this.$element.find('.tabsHeader ul.tabsList li:visible:last');
				tabVisibleLast.addClass("ui-state-active");
				$this.$element.find('.tabContent .LRADMS_iframe:visible').hide();
				$this.$element.find('.tabContent iframe[data-id="' +  tabVisibleLast.data('id') + '"]').show();
			}
		});
		// 焦点
		this.$element.find('.tabsHeader ul.tabsList').on('mouseenter','li',function () {
			$(this).addClass('ui-state-hover');
		});
		this.$element.find('.tabsHeader ul.tabsList').on('mouseleave','li',function () {
			$(this).removeClass('ui-state-hover');
		});
		// 操作菜单
		$.contextMenu({
			selector: '.jqTab .tabsHeader .rightPanel .tabsOpe',
			trigger: 'left',
			callback:function (itemKey, opt, e) {
				return false;
			},
			items: {
				"tabReload": {name: "刷新当前", icon: "fa-refresh",callback:function (itemKey, opt, e) {
						var _iframe = $('.jqTab .tabContent iframe[data-id="' +
							$this.$element.find('.tabsHeader ul.tabsList li.ui-state-active').data("id") + '"]');
						var url = _iframe.attr('src');
						_iframe.attr('src',url);
						// return false;
					}},
				"tabCloseCurrent": {name: "关闭当前", icon: "fa-remove",callback:function (itemKey, opt, e) {
						$this.$element.find(' .tabsHeader ul.tabsList li.ui-state-active span.ui-icon-close').trigger("click");
					}},
				tabCloseAll: {name: "全部关闭", icon: "fa-times",callback:function (itemKey, opt, e) {
						$this.$element.find('.tabsHeader ul.tabsList li span.ui-icon-close').each(function () {
							$this.$element.find('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
							$(this).parents('li').remove();
						});
						var lastTab = $this.$element.find('.tabsHeader ul.tabsList li:last').addClass('ui-state-active');
						lastTab.show("slide",{}, 500,function () {
							// alert($(this).text());
						});
						var id = lastTab.data('id');
						$this.$element.find('.tabContent .LRADMS_iframe:visible').hide();
						$this.$element.find('.tabContent iframe[data-id="' +  id + '"]').show();
					}},
				"tabCloseOther": {name: "除此之外全部关闭", icon: "fa-times-circle",callback:function (itemKey, opt, e) {
						$this.$element.find('.tabsHeader .tabsList li span.ui-icon-close').parents('li').not(".ui-state-active").each(function () {
							$this.$element.find('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
							$(this).remove();
						});
					}},
				"sep1": "---------",
				"fullScreen": {name: "全屏", icon: "fa-arrows-alt",callback:function (itemKey, opt, e) {
						if (!$(this).attr('fullscreen')) {
							$(this).attr('fullscreen', 'true');
							private_methods.requestFullScreen();
						} else {
							$(this).removeAttr('fullscreen')
							private_methods.exitFullscreen();
							opt.items.fullScreen.name
						}
					}}
			},
			events: {
				show: function (options) {
					options.$menu.addClass('ui-widget-content');
					if ($(this).attr('fullscreen')) {
						$(options.items.fullScreen.$node[0]).text('退出全屏');
					} else {
						$(options.items.fullScreen.$node[0]).text('全屏');
					}
					return true;
				}}
		});
		$('.jqTab').tooltip();
	};
	jqTab.prototype = {
		addTab: function (dataUrl,tabName,noClose) {
			if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
				return ;
			}
			var tab = this.$element.find( '.tabsHeader ul.tabsList li[data-id="' + dataUrl + '"]');
			if(tab.length > 0){
				var url = $this.$element.find('.tabsHeader ul.tabsList li.ui-state-active').data('id');
				if(url == dataUrl){
					return;
				}
				this.$element.find('.tabsHeader ul.tabsList li.ui-state-active').removeClass("ui-state-active");
				tab.addClass("ui-state-active");
				this.$element.find('.tabContent .LRADMS_iframe:visible').hide();
				this.$element.find('.tabContent iframe[data-id="' + dataUrl + '"]').show();
				return;
			}
			this.$element.find('.tabsHeader .tabsList li.ui-state-active').removeClass("ui-state-active");
			var $icon = noClose? '':'<span class="ui-icon ui-icon-close"></span>';
			var $tab = '<li class="ui-state-default ui-state-active ui-corner-top ui-widget" data-id="' + dataUrl + '">\
							<a title="' + tabName + '" >' + tabName + '</a>' + $icon + '</li>';
			this.$element.find('.tabsHeader ul.tabsList').append($tab);
			this.$element.find('.tabContent .LRADMS_iframe:visible').hide();
			var $iframe= '<iframe class="LRADMS_iframe" scrolling = "auto" width="100%" height="100%" src="'+ dataUrl +
				'" frameborder="0" data-id="'+ dataUrl +'" seamless></iframe>';
			this.$element.find('.tabContent').append($iframe);
			// 滚动标签
			var tabListWidth = this.$element.find('.tabsHeader ul.tabsList').outerWidth();
			var tabVisibleWidth = private_methods.calSumWidth(this.$element.find('.tabsHeader ul.tabsList li:visible'));
			if (tabVisibleWidth > tabListWidth) {
				this.$element.find( ".tabsHeader ul.tabsList li:visible:first" ).hide();
			}
		}
	};
	var private_methods = {
		calSumWidth: function (element) {
			var width = 0;
			$(element).each(function () {
				width += $(this).outerWidth(true);
			});
			return width;
		},
		requestFullScreen: function () {
			var de = document.documentElement;
			if (de.requestFullscreen) {
				de.requestFullscreen();
			} else if (de.mozRequestFullScreen) {
				de.mozRequestFullScreen();
			} else if (de.webkitRequestFullScreen) {
				de.webkitRequestFullScreen();
			}
		},
		exitFullscreen: function () {
			var de = document;
			if (de.exitFullscreen) {
				de.exitFullscreen();
			} else if (de.mozCancelFullScreen) {
				de.mozCancelFullScreen();
			} else if (de.webkitCancelFullScreen) {
				de.webkitCancelFullScreen();
			}
		}
	};
	$.fn.JqTab = function (option) {
		var args = Array.prototype.slice.call(arguments,1);
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('cc.JqTab');
			var options = typeof option == 'object' && option;
			// 如果没有初始化过, 就初始化它
			// 如果该元素没有初始化过(可能是新添加的元素), 就初始化它.
			if (!data) $this.data('cc.JqTab', (data = new jqTab(this, options)));
			// 调用方法
			if (typeof option === "string" && typeof data[option] == "function") {
				// 执行插件的方法
				data[option].apply(data, args);
			}
		});
	};
	$.fn.JqTab.Constructor = jqTab;
	$.fn.JqTab.defaults = {};
})(jQuery);