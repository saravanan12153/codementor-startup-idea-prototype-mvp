!function($,undefined){function UTCDate(){return new Date(Date.UTC.apply(Date,arguments))}function UTCToday(){var today=new Date;return UTCDate(today.getFullYear(),today.getMonth(),today.getDate())}function alias(method){return function(){return this[method].apply(this,arguments)}}function opts_from_el(el,prefix){function re_lower(_,a){return a.toLowerCase()}var inkey,data=$(el).data(),out={},replace=new RegExp("^"+prefix.toLowerCase()+"([A-Z])");prefix=new RegExp("^"+prefix.toLowerCase());for(var key in data)prefix.test(key)&&(inkey=key.replace(replace,re_lower),out[inkey]=data[key]);return out}function opts_from_locale(lang){var out={};if(dates[lang]||(lang=lang.split("-")[0],dates[lang])){var d=dates[lang];return $.each(locale_opts,function(i,k){k in d&&(out[k]=d[k])}),out}}var $window=$(window),DateArray=function(){var extras={get:function(i){return this.slice(i)[0]},contains:function(d){for(var val=d&&d.valueOf(),i=0,l=this.length;l>i;i++)if(this[i].valueOf()===val)return i;return-1},remove:function(i){this.splice(i,1)},replace:function(new_array){new_array&&($.isArray(new_array)||(new_array=[new_array]),this.clear(),this.push.apply(this,new_array))},clear:function(){this.length=0},copy:function(){var a=new DateArray;return a.replace(this),a}};return function(){var a=[];return a.push.apply(a,arguments),$.extend(a,extras),a}}(),Datepicker=function(element,options){this.dates=new DateArray,this.viewDate=UTCToday(),this.focusDate=null,this._process_options(options),this.element=$(element),this.isInline=!1,this.isInput=this.element.is("input"),this.component=this.element.is(".date")?this.element.find(".add-on, .input-group-addon, .btn"):!1,this.hasInput=this.component&&this.element.find("input").length,this.component&&0===this.component.length&&(this.component=!1),this.picker=$(DPGlobal.template),this._buildEvents(),this._attachEvents(),this.isInline?this.picker.addClass("datepicker-inline").appendTo(this.element):this.picker.addClass("datepicker-dropdown dropdown-menu"),this.o.rtl&&this.picker.addClass("datepicker-rtl"),this.viewMode=this.o.startView,this.o.calendarWeeks&&this.picker.find("tfoot th.today").attr("colspan",function(i,val){return parseInt(val)+1}),this._allow_update=!1,this.setStartDate(this._o.startDate),this.setEndDate(this._o.endDate),this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled),this.fillDow(),this.fillMonths(),this._allow_update=!0,this.update(),this.showMode(),this.isInline&&this.show()};Datepicker.prototype={constructor:Datepicker,_process_options:function(opts){this._o=$.extend({},this._o,opts);var o=this.o=$.extend({},this._o),lang=o.language;switch(dates[lang]||(lang=lang.split("-")[0],dates[lang]||(lang=defaults.language)),o.language=lang,o.startView){case 2:case"decade":o.startView=2;break;case 1:case"year":o.startView=1;break;default:o.startView=0}switch(o.minViewMode){case 1:case"months":o.minViewMode=1;break;case 2:case"years":o.minViewMode=2;break;default:o.minViewMode=0}o.startView=Math.max(o.startView,o.minViewMode),o.multidate!==!0&&(o.multidate=Number(o.multidate)||!1,o.multidate!==!1&&(o.multidate=Math.max(0,o.multidate))),o.multidateSeparator=String(o.multidateSeparator),o.weekStart%=7,o.weekEnd=(o.weekStart+6)%7;var format=DPGlobal.parseFormat(o.format);o.startDate!==-1/0&&(o.startDate=o.startDate?o.startDate instanceof Date?this._local_to_utc(this._zero_time(o.startDate)):DPGlobal.parseDate(o.startDate,format,o.language):-1/0),1/0!==o.endDate&&(o.endDate=o.endDate?o.endDate instanceof Date?this._local_to_utc(this._zero_time(o.endDate)):DPGlobal.parseDate(o.endDate,format,o.language):1/0),o.daysOfWeekDisabled=o.daysOfWeekDisabled||[],$.isArray(o.daysOfWeekDisabled)||(o.daysOfWeekDisabled=o.daysOfWeekDisabled.split(/[,\s]*/)),o.daysOfWeekDisabled=$.map(o.daysOfWeekDisabled,function(d){return parseInt(d,10)});var plc=String(o.orientation).toLowerCase().split(/\s+/g),_plc=o.orientation.toLowerCase();if(plc=$.grep(plc,function(word){return/^auto|left|right|top|bottom$/.test(word)}),o.orientation={x:"auto",y:"auto"},_plc&&"auto"!==_plc)if(1===plc.length)switch(plc[0]){case"top":case"bottom":o.orientation.y=plc[0];break;case"left":case"right":o.orientation.x=plc[0]}else _plc=$.grep(plc,function(word){return/^left|right$/.test(word)}),o.orientation.x=_plc[0]||"auto",_plc=$.grep(plc,function(word){return/^top|bottom$/.test(word)}),o.orientation.y=_plc[0]||"auto";else;},_events:[],_secondaryEvents:[],_applyEvents:function(evs){for(var el,ch,ev,i=0;i<evs.length;i++)el=evs[i][0],2===evs[i].length?(ch=undefined,ev=evs[i][1]):3===evs[i].length&&(ch=evs[i][1],ev=evs[i][2]),el.on(ev,ch)},_unapplyEvents:function(evs){for(var el,ev,ch,i=0;i<evs.length;i++)el=evs[i][0],2===evs[i].length?(ch=undefined,ev=evs[i][1]):3===evs[i].length&&(ch=evs[i][1],ev=evs[i][2]),el.off(ev,ch)},_buildEvents:function(){this.isInput?this._events=[[this.element,{focus:$.proxy(this.show,this),keyup:$.proxy(function(e){-1===$.inArray(e.keyCode,[27,37,39,38,40,32,13,9])&&this.update()},this),keydown:$.proxy(this.keydown,this)}]]:this.component&&this.hasInput?this._events=[[this.element.find("input"),{focus:$.proxy(this.show,this),keyup:$.proxy(function(e){-1===$.inArray(e.keyCode,[27,37,39,38,40,32,13,9])&&this.update()},this),keydown:$.proxy(this.keydown,this)}],[this.component,{click:$.proxy(this.show,this)}]]:this.element.is("div")?this.isInline=!0:this._events=[[this.element,{click:$.proxy(this.show,this)}]],this._events.push([this.element,"*",{blur:$.proxy(function(e){this._focused_from=e.target},this)}],[this.element,{blur:$.proxy(function(e){this._focused_from=e.target},this)}]),this._secondaryEvents=[[this.picker,{click:$.proxy(this.click,this)}],[$(window),{resize:$.proxy(this.place,this)}],[$(document),{"mousedown touchstart":$.proxy(function(e){this.element.is(e.target)||this.element.find(e.target).length||this.picker.is(e.target)||this.picker.find(e.target).length||this.hide()},this)}]]},_attachEvents:function(){this._detachEvents(),this._applyEvents(this._events)},_detachEvents:function(){this._unapplyEvents(this._events)},_attachSecondaryEvents:function(){this._detachSecondaryEvents(),this._applyEvents(this._secondaryEvents)},_detachSecondaryEvents:function(){this._unapplyEvents(this._secondaryEvents)},_trigger:function(event,altdate){var date=altdate||this.dates.get(-1),local_date=this._utc_to_local(date);this.element.trigger({type:event,date:local_date,dates:$.map(this.dates,this._utc_to_local),format:$.proxy(function(ix,format){0===arguments.length?(ix=this.dates.length-1,format=this.o.format):"string"==typeof ix&&(format=ix,ix=this.dates.length-1),format=format||this.o.format;var date=this.dates.get(ix);return DPGlobal.formatDate(date,format,this.o.language)},this)})},show:function(){this.isInline||this.picker.appendTo("body"),this.picker.show(),this.place(),this._attachSecondaryEvents(),this._trigger("show")},hide:function(){this.isInline||this.picker.is(":visible")&&(this.focusDate=null,this.picker.hide().detach(),this._detachSecondaryEvents(),this.viewMode=this.o.startView,this.showMode(),this.o.forceParse&&(this.isInput&&this.element.val()||this.hasInput&&this.element.find("input").val())&&this.setValue(),this._trigger("hide"))},remove:function(){this.hide(),this._detachEvents(),this._detachSecondaryEvents(),this.picker.remove(),delete this.element.data().datepicker,this.isInput||delete this.element.data().date},_utc_to_local:function(utc){return utc&&new Date(utc.getTime()+6e4*utc.getTimezoneOffset())},_local_to_utc:function(local){return local&&new Date(local.getTime()-6e4*local.getTimezoneOffset())},_zero_time:function(local){return local&&new Date(local.getFullYear(),local.getMonth(),local.getDate())},_zero_utc_time:function(utc){return utc&&new Date(Date.UTC(utc.getUTCFullYear(),utc.getUTCMonth(),utc.getUTCDate()))},getDates:function(){return $.map(this.dates,this._utc_to_local)},getUTCDates:function(){return $.map(this.dates,function(d){return new Date(d)})},getDate:function(){return this._utc_to_local(this.getUTCDate())},getUTCDate:function(){return new Date(this.dates.get(-1))},setDates:function(){var args=$.isArray(arguments[0])?arguments[0]:arguments;this.update.apply(this,args),this._trigger("changeDate"),this.setValue()},setUTCDates:function(){var args=$.isArray(arguments[0])?arguments[0]:arguments;this.update.apply(this,$.map(args,this._utc_to_local)),this._trigger("changeDate"),this.setValue()},setDate:alias("setDates"),setUTCDate:alias("setUTCDates"),setValue:function(){var formatted=this.getFormattedDate();this.isInput?this.element.val(formatted).change():this.component&&this.element.find("input").val(formatted).change()},getFormattedDate:function(format){format===undefined&&(format=this.o.format);var lang=this.o.language;return $.map(this.dates,function(d){return DPGlobal.formatDate(d,format,lang)}).join(this.o.multidateSeparator)},setStartDate:function(startDate){this._process_options({startDate:startDate}),this.update(),this.updateNavArrows()},setEndDate:function(endDate){this._process_options({endDate:endDate}),this.update(),this.updateNavArrows()},setDaysOfWeekDisabled:function(daysOfWeekDisabled){this._process_options({daysOfWeekDisabled:daysOfWeekDisabled}),this.update(),this.updateNavArrows()},place:function(){if(!this.isInline){var calendarWidth=this.picker.outerWidth(),calendarHeight=this.picker.outerHeight(),visualPadding=10,windowWidth=$window.width(),windowHeight=$window.height(),scrollTop=$window.scrollTop(),zIndex=parseInt(this.element.parents().filter(function(){return"auto"!==$(this).css("z-index")}).first().css("z-index"))+10,offset=this.component?this.component.parent().offset():this.element.offset(),height=this.component?this.component.outerHeight(!0):this.element.outerHeight(!1),width=this.component?this.component.outerWidth(!0):this.element.outerWidth(!1),left=offset.left,top=offset.top;this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"),"auto"!==this.o.orientation.x?(this.picker.addClass("datepicker-orient-"+this.o.orientation.x),"right"===this.o.orientation.x&&(left-=calendarWidth-width)):(this.picker.addClass("datepicker-orient-left"),offset.left<0?left-=offset.left-visualPadding:offset.left+calendarWidth>windowWidth&&(left=windowWidth-calendarWidth-visualPadding));var top_overflow,bottom_overflow,yorient=this.o.orientation.y;"auto"===yorient&&(top_overflow=-scrollTop+offset.top-calendarHeight,bottom_overflow=scrollTop+windowHeight-(offset.top+height+calendarHeight),yorient=Math.max(top_overflow,bottom_overflow)===bottom_overflow?"top":"bottom"),this.picker.addClass("datepicker-orient-"+yorient),"top"===yorient?top+=height:top-=calendarHeight+parseInt(this.picker.css("padding-top")),this.picker.css({top:top,left:left,zIndex:zIndex})}},_allow_update:!0,update:function(){if(this._allow_update){var oldDates=this.dates.copy(),dates=[],fromArgs=!1;arguments.length?($.each(arguments,$.proxy(function(i,date){date instanceof Date&&(date=this._local_to_utc(date)),dates.push(date)},this)),fromArgs=!0):(dates=this.isInput?this.element.val():this.element.data("date")||this.element.find("input").val(),dates=dates&&this.o.multidate?dates.split(this.o.multidateSeparator):[dates],delete this.element.data().date),dates=$.map(dates,$.proxy(function(date){return DPGlobal.parseDate(date,this.o.format,this.o.language)},this)),dates=$.grep(dates,$.proxy(function(date){return date<this.o.startDate||date>this.o.endDate||!date},this),!0),this.dates.replace(dates),this.dates.length?this.viewDate=new Date(this.dates.get(-1)):this.viewDate<this.o.startDate?this.viewDate=new Date(this.o.startDate):this.viewDate>this.o.endDate&&(this.viewDate=new Date(this.o.endDate)),fromArgs?this.setValue():dates.length&&String(oldDates)!==String(this.dates)&&this._trigger("changeDate"),!this.dates.length&&oldDates.length&&this._trigger("clearDate"),this.fill()}},fillDow:function(){var dowCnt=this.o.weekStart,html="<tr>";if(this.o.calendarWeeks){var cell='<th class="cw">&nbsp;</th>';html+=cell,this.picker.find(".datepicker-days thead tr:first-child").prepend(cell)}for(;dowCnt<this.o.weekStart+7;)html+='<th class="dow">'+dates[this.o.language].daysMin[dowCnt++%7]+"</th>";html+="</tr>",this.picker.find(".datepicker-days thead").append(html)},fillMonths:function(){for(var html="",i=0;12>i;)html+='<span class="month">'+dates[this.o.language].monthsShort[i++]+"</span>";this.picker.find(".datepicker-months td").html(html)},setRange:function(range){range&&range.length?this.range=$.map(range,function(d){return d.valueOf()}):delete this.range,this.fill()},getClassNames:function(date){var cls=[],year=this.viewDate.getUTCFullYear(),month=this.viewDate.getUTCMonth(),today=new Date;return date.getUTCFullYear()<year||date.getUTCFullYear()===year&&date.getUTCMonth()<month?cls.push("old"):(date.getUTCFullYear()>year||date.getUTCFullYear()===year&&date.getUTCMonth()>month)&&cls.push("new"),this.focusDate&&date.valueOf()===this.focusDate.valueOf()&&cls.push("focused"),this.o.todayHighlight&&date.getUTCFullYear()===today.getFullYear()&&date.getUTCMonth()===today.getMonth()&&date.getUTCDate()===today.getDate()&&cls.push("today"),-1!==this.dates.contains(date)&&cls.push("active"),(date.valueOf()<this.o.startDate||date.valueOf()>this.o.endDate||-1!==$.inArray(date.getUTCDay(),this.o.daysOfWeekDisabled))&&cls.push("disabled"),this.range&&(date>this.range[0]&&date<this.range[this.range.length-1]&&cls.push("range"),-1!==$.inArray(date.valueOf(),this.range)&&cls.push("selected")),cls},fill:function(){var tooltip,d=new Date(this.viewDate),year=d.getUTCFullYear(),month=d.getUTCMonth(),startYear=this.o.startDate!==-1/0?this.o.startDate.getUTCFullYear():-1/0,startMonth=this.o.startDate!==-1/0?this.o.startDate.getUTCMonth():-1/0,endYear=1/0!==this.o.endDate?this.o.endDate.getUTCFullYear():1/0,endMonth=1/0!==this.o.endDate?this.o.endDate.getUTCMonth():1/0,todaytxt=dates[this.o.language].today||dates.en.today||"",cleartxt=dates[this.o.language].clear||dates.en.clear||"";this.picker.find(".datepicker-days thead th.datepicker-switch").text(dates[this.o.language].months[month]+" "+year),this.picker.find("tfoot th.today").text(todaytxt).toggle(this.o.todayBtn!==!1),this.picker.find("tfoot th.clear").text(cleartxt).toggle(this.o.clearBtn!==!1),this.updateNavArrows(),this.fillMonths();var prevMonth=UTCDate(year,month-1,28),day=DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(),prevMonth.getUTCMonth());prevMonth.setUTCDate(day),prevMonth.setUTCDate(day-(prevMonth.getUTCDay()-this.o.weekStart+7)%7);var nextMonth=new Date(prevMonth);nextMonth.setUTCDate(nextMonth.getUTCDate()+42),nextMonth=nextMonth.valueOf();for(var clsName,html=[];prevMonth.valueOf()<nextMonth;){if(prevMonth.getUTCDay()===this.o.weekStart&&(html.push("<tr>"),this.o.calendarWeeks)){var ws=new Date(+prevMonth+(this.o.weekStart-prevMonth.getUTCDay()-7)%7*864e5),th=new Date(Number(ws)+(11-ws.getUTCDay())%7*864e5),yth=new Date(Number(yth=UTCDate(th.getUTCFullYear(),0,1))+(11-yth.getUTCDay())%7*864e5),calWeek=(th-yth)/864e5/7+1;html.push('<td class="cw">'+calWeek+"</td>")}if(clsName=this.getClassNames(prevMonth),clsName.push("day"),this.o.beforeShowDay!==$.noop){var before=this.o.beforeShowDay(this._utc_to_local(prevMonth));before===undefined?before={}:"boolean"==typeof before?before={enabled:before}:"string"==typeof before&&(before={classes:before}),before.enabled===!1&&clsName.push("disabled"),before.classes&&(clsName=clsName.concat(before.classes.split(/\s+/))),before.tooltip&&(tooltip=before.tooltip)}clsName=$.unique(clsName),html.push('<td class="'+clsName.join(" ")+'"'+(tooltip?' title="'+tooltip+'"':"")+">"+prevMonth.getUTCDate()+"</td>"),prevMonth.getUTCDay()===this.o.weekEnd&&html.push("</tr>"),prevMonth.setUTCDate(prevMonth.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").empty().append(html.join(""));var months=this.picker.find(".datepicker-months").find("th:eq(1)").text(year).end().find("span").removeClass("active");$.each(this.dates,function(i,d){d.getUTCFullYear()===year&&months.eq(d.getUTCMonth()).addClass("active")}),(startYear>year||year>endYear)&&months.addClass("disabled"),year===startYear&&months.slice(0,startMonth).addClass("disabled"),year===endYear&&months.slice(endMonth+1).addClass("disabled"),html="",year=10*parseInt(year/10,10);var yearCont=this.picker.find(".datepicker-years").find("th:eq(1)").text(year+"-"+(year+9)).end().find("td");year-=1;for(var classes,years=$.map(this.dates,function(d){return d.getUTCFullYear()}),i=-1;11>i;i++)classes=["year"],-1===i?classes.push("old"):10===i&&classes.push("new"),-1!==$.inArray(year,years)&&classes.push("active"),(startYear>year||year>endYear)&&classes.push("disabled"),html+='<span class="'+classes.join(" ")+'">'+year+"</span>",year+=1;yearCont.html(html)},updateNavArrows:function(){if(this._allow_update){var d=new Date(this.viewDate),year=d.getUTCFullYear(),month=d.getUTCMonth();switch(this.viewMode){case 0:this.picker.find(".prev").css(this.o.startDate!==-1/0&&year<=this.o.startDate.getUTCFullYear()&&month<=this.o.startDate.getUTCMonth()?{visibility:"hidden"}:{visibility:"visible"}),this.picker.find(".next").css(1/0!==this.o.endDate&&year>=this.o.endDate.getUTCFullYear()&&month>=this.o.endDate.getUTCMonth()?{visibility:"hidden"}:{visibility:"visible"});break;case 1:case 2:this.picker.find(".prev").css(this.o.startDate!==-1/0&&year<=this.o.startDate.getUTCFullYear()?{visibility:"hidden"}:{visibility:"visible"}),this.picker.find(".next").css(1/0!==this.o.endDate&&year>=this.o.endDate.getUTCFullYear()?{visibility:"hidden"}:{visibility:"visible"})}}},click:function(e){e.preventDefault();var year,month,day,target=$(e.target).closest("span, td, th");if(1===target.length)switch(target[0].nodeName.toLowerCase()){case"th":switch(target[0].className){case"datepicker-switch":this.showMode(1);break;case"prev":case"next":var dir=DPGlobal.modes[this.viewMode].navStep*("prev"===target[0].className?-1:1);switch(this.viewMode){case 0:this.viewDate=this.moveMonth(this.viewDate,dir),this._trigger("changeMonth",this.viewDate);break;case 1:case 2:this.viewDate=this.moveYear(this.viewDate,dir),1===this.viewMode&&this._trigger("changeYear",this.viewDate)}this.fill();break;case"today":var date=new Date;date=UTCDate(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0),this.showMode(-2);var which="linked"===this.o.todayBtn?null:"view";this._setDate(date,which);break;case"clear":var element;this.isInput?element=this.element:this.component&&(element=this.element.find("input")),element&&element.val("").change(),this.update(),this._trigger("changeDate"),this.o.autoclose&&this.hide()}break;case"span":target.is(".disabled")||(this.viewDate.setUTCDate(1),target.is(".month")?(day=1,month=target.parent().find("span").index(target),year=this.viewDate.getUTCFullYear(),this.viewDate.setUTCMonth(month),this._trigger("changeMonth",this.viewDate),1===this.o.minViewMode&&this._setDate(UTCDate(year,month,day))):(day=1,month=0,year=parseInt(target.text(),10)||0,this.viewDate.setUTCFullYear(year),this._trigger("changeYear",this.viewDate),2===this.o.minViewMode&&this._setDate(UTCDate(year,month,day))),this.showMode(-1),this.fill());break;case"td":target.is(".day")&&!target.is(".disabled")&&(day=parseInt(target.text(),10)||1,year=this.viewDate.getUTCFullYear(),month=this.viewDate.getUTCMonth(),target.is(".old")?0===month?(month=11,year-=1):month-=1:target.is(".new")&&(11===month?(month=0,year+=1):month+=1),this._setDate(UTCDate(year,month,day)))}this.picker.is(":visible")&&this._focused_from&&$(this._focused_from).focus(),delete this._focused_from},_toggle_multidate:function(date){var ix=this.dates.contains(date);if(date){if(this.o.multidate===!1)this.dates.clear(),this.dates.push(date);else if(-1!==ix?this.dates.remove(ix):this.dates.push(date),"number"==typeof this.o.multidate)for(;this.dates.length>this.o.multidate;)this.dates.remove(0)}else this.dates.clear()},_setDate:function(date,which){which&&"date"!==which||this._toggle_multidate(date&&new Date(date)),which&&"view"!==which||(this.viewDate=date&&new Date(date)),this.fill(),this.setValue(),this._trigger("changeDate");var element;this.isInput?element=this.element:this.component&&(element=this.element.find("input")),element&&element.change(),!this.o.autoclose||which&&"date"!==which||this.hide()},moveMonth:function(date,dir){if(!date)return undefined;if(!dir)return date;var new_month,test,new_date=new Date(date.valueOf()),day=new_date.getUTCDate(),month=new_date.getUTCMonth(),mag=Math.abs(dir);if(dir=dir>0?1:-1,1===mag)test=-1===dir?function(){return new_date.getUTCMonth()===month}:function(){return new_date.getUTCMonth()!==new_month},new_month=month+dir,new_date.setUTCMonth(new_month),(0>new_month||new_month>11)&&(new_month=(new_month+12)%12);else{for(var i=0;mag>i;i++)new_date=this.moveMonth(new_date,dir);new_month=new_date.getUTCMonth(),new_date.setUTCDate(day),test=function(){return new_month!==new_date.getUTCMonth()}}for(;test();)new_date.setUTCDate(--day),new_date.setUTCMonth(new_month);return new_date},moveYear:function(date,dir){return this.moveMonth(date,12*dir)},dateWithinRange:function(date){return date>=this.o.startDate&&date<=this.o.endDate},keydown:function(e){if(this.picker.is(":not(:visible)"))return void(27===e.keyCode&&this.show());var dir,newDate,newViewDate,dateChanged=!1,focusDate=this.focusDate||this.viewDate;switch(e.keyCode){case 27:this.focusDate?(this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill()):this.hide(),e.preventDefault();break;case 37:case 39:if(!this.o.keyboardNavigation)break;dir=37===e.keyCode?-1:1,e.ctrlKey?(newDate=this.moveYear(this.dates.get(-1)||UTCToday(),dir),newViewDate=this.moveYear(focusDate,dir),this._trigger("changeYear",this.viewDate)):e.shiftKey?(newDate=this.moveMonth(this.dates.get(-1)||UTCToday(),dir),newViewDate=this.moveMonth(focusDate,dir),this._trigger("changeMonth",this.viewDate)):(newDate=new Date(this.dates.get(-1)||UTCToday()),newDate.setUTCDate(newDate.getUTCDate()+dir),newViewDate=new Date(focusDate),newViewDate.setUTCDate(focusDate.getUTCDate()+dir)),this.dateWithinRange(newDate)&&(this.focusDate=this.viewDate=newViewDate,this.setValue(),this.fill(),e.preventDefault());break;case 38:case 40:if(!this.o.keyboardNavigation)break;dir=38===e.keyCode?-1:1,e.ctrlKey?(newDate=this.moveYear(this.dates.get(-1)||UTCToday(),dir),newViewDate=this.moveYear(focusDate,dir),this._trigger("changeYear",this.viewDate)):e.shiftKey?(newDate=this.moveMonth(this.dates.get(-1)||UTCToday(),dir),newViewDate=this.moveMonth(focusDate,dir),this._trigger("changeMonth",this.viewDate)):(newDate=new Date(this.dates.get(-1)||UTCToday()),newDate.setUTCDate(newDate.getUTCDate()+7*dir),newViewDate=new Date(focusDate),newViewDate.setUTCDate(focusDate.getUTCDate()+7*dir)),this.dateWithinRange(newDate)&&(this.focusDate=this.viewDate=newViewDate,this.setValue(),this.fill(),e.preventDefault());break;case 32:break;case 13:focusDate=this.focusDate||this.dates.get(-1)||this.viewDate,this._toggle_multidate(focusDate),dateChanged=!0,this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.setValue(),this.fill(),this.picker.is(":visible")&&(e.preventDefault(),this.o.autoclose&&this.hide());break;case 9:this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill(),this.hide()}if(dateChanged){this._trigger(this.dates.length?"changeDate":"clearDate");var element;this.isInput?element=this.element:this.component&&(element=this.element.find("input")),element&&element.change()}},showMode:function(dir){dir&&(this.viewMode=Math.max(this.o.minViewMode,Math.min(2,this.viewMode+dir))),this.picker.find(">div").hide().filter(".datepicker-"+DPGlobal.modes[this.viewMode].clsName).css("display","block"),this.updateNavArrows()}};var DateRangePicker=function(element,options){this.element=$(element),this.inputs=$.map(options.inputs,function(i){return i.jquery?i[0]:i}),delete options.inputs,$(this.inputs).datepicker(options).bind("changeDate",$.proxy(this.dateUpdated,this)),this.pickers=$.map(this.inputs,function(i){return $(i).data("datepicker")}),this.updateDates()};DateRangePicker.prototype={updateDates:function(){this.dates=$.map(this.pickers,function(i){return i.getUTCDate()}),this.updateRanges()},updateRanges:function(){var range=$.map(this.dates,function(d){return d.valueOf()});$.each(this.pickers,function(i,p){p.setRange(range)})},dateUpdated:function(e){if(!this.updating){this.updating=!0;var dp=$(e.target).data("datepicker"),new_date=dp.getUTCDate(),i=$.inArray(e.target,this.inputs),l=this.inputs.length;if(-1!==i){if($.each(this.pickers,function(i,p){p.getUTCDate()||p.setUTCDate(new_date)}),new_date<this.dates[i])for(;i>=0&&new_date<this.dates[i];)this.pickers[i--].setUTCDate(new_date);else if(new_date>this.dates[i])for(;l>i&&new_date>this.dates[i];)this.pickers[i++].setUTCDate(new_date);this.updateDates(),delete this.updating}}},remove:function(){$.map(this.pickers,function(p){p.remove()}),delete this.element.data().datepicker}};var old=$.fn.datepicker;$.fn.datepicker=function(option){var args=Array.apply(null,arguments);args.shift();var internal_return;return this.each(function(){var $this=$(this),data=$this.data("datepicker"),options="object"==typeof option&&option;if(!data){var elopts=opts_from_el(this,"date"),xopts=$.extend({},defaults,elopts,options),locopts=opts_from_locale(xopts.language),opts=$.extend({},defaults,locopts,elopts,options);if($this.is(".input-daterange")||opts.inputs){var ropts={inputs:opts.inputs||$this.find("input").toArray()};$this.data("datepicker",data=new DateRangePicker(this,$.extend(opts,ropts)))}else $this.data("datepicker",data=new Datepicker(this,opts))}return"string"==typeof option&&"function"==typeof data[option]&&(internal_return=data[option].apply(data,args),internal_return!==undefined)?!1:void 0}),internal_return!==undefined?internal_return:this};var defaults=$.fn.datepicker.defaults={autoclose:!1,beforeShowDay:$.noop,calendarWeeks:!1,clearBtn:!1,daysOfWeekDisabled:[],endDate:1/0,forceParse:!0,format:"mm/dd/yyyy",keyboardNavigation:!0,language:"en",minViewMode:0,multidate:!1,multidateSeparator:",",orientation:"auto",rtl:!1,startDate:-1/0,startView:0,todayBtn:!1,todayHighlight:!1,weekStart:0},locale_opts=$.fn.datepicker.locale_opts=["format","rtl","weekStart"];$.fn.datepicker.Constructor=Datepicker;var dates=$.fn.datepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear"}},DPGlobal={modes:[{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(year){return year%4===0&&year%100!==0||year%400===0},getDaysInMonth:function(year,month){return[31,DPGlobal.isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31][month]},validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,parseFormat:function(format){var separators=format.replace(this.validParts,"\x00").split("\x00"),parts=format.match(this.validParts);if(!separators||!separators.length||!parts||0===parts.length)throw new Error("Invalid date format.");return{separators:separators,parts:parts}},parseDate:function(date,format,language){function match_part(){var m=this.slice(0,parts[i].length),p=parts[i].slice(0,m.length);return m===p}if(!date)return undefined;if(date instanceof Date)return date;"string"==typeof format&&(format=DPGlobal.parseFormat(format));var part,dir,i,part_re=/([\-+]\d+)([dmwy])/,parts=date.match(/([\-+]\d+)([dmwy])/g);if(/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){for(date=new Date,i=0;i<parts.length;i++)switch(part=part_re.exec(parts[i]),dir=parseInt(part[1]),part[2]){case"d":date.setUTCDate(date.getUTCDate()+dir);break;case"m":date=Datepicker.prototype.moveMonth.call(Datepicker.prototype,date,dir);break;case"w":date.setUTCDate(date.getUTCDate()+7*dir);break;case"y":date=Datepicker.prototype.moveYear.call(Datepicker.prototype,date,dir)}return UTCDate(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),0,0,0)}parts=date&&date.match(this.nonpunctuation)||[],date=new Date;var val,filtered,parsed={},setters_order=["yyyy","yy","M","MM","m","mm","d","dd"],setters_map={yyyy:function(d,v){return d.setUTCFullYear(v)},yy:function(d,v){return d.setUTCFullYear(2e3+v)},m:function(d,v){if(isNaN(d))return d;for(v-=1;0>v;)v+=12;for(v%=12,d.setUTCMonth(v);d.getUTCMonth()!==v;)d.setUTCDate(d.getUTCDate()-1);return d},d:function(d,v){return d.setUTCDate(v)}};setters_map.M=setters_map.MM=setters_map.mm=setters_map.m,setters_map.dd=setters_map.d,date=UTCDate(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);var fparts=format.parts.slice();if(parts.length!==fparts.length&&(fparts=$(fparts).filter(function(i,p){return-1!==$.inArray(p,setters_order)}).toArray()),parts.length===fparts.length){var cnt;for(i=0,cnt=fparts.length;cnt>i;i++){if(val=parseInt(parts[i],10),part=fparts[i],isNaN(val))switch(part){case"MM":filtered=$(dates[language].months).filter(match_part),val=$.inArray(filtered[0],dates[language].months)+1;break;case"M":filtered=$(dates[language].monthsShort).filter(match_part),val=$.inArray(filtered[0],dates[language].monthsShort)+1}parsed[part]=val}var _date,s;for(i=0;i<setters_order.length;i++)s=setters_order[i],s in parsed&&!isNaN(parsed[s])&&(_date=new Date(date),setters_map[s](_date,parsed[s]),isNaN(_date)||(date=_date))}return date},formatDate:function(date,format,language){if(!date)return"";"string"==typeof format&&(format=DPGlobal.parseFormat(format));var val={d:date.getUTCDate(),D:dates[language].daysShort[date.getUTCDay()],DD:dates[language].days[date.getUTCDay()],m:date.getUTCMonth()+1,M:dates[language].monthsShort[date.getUTCMonth()],MM:dates[language].months[date.getUTCMonth()],yy:date.getUTCFullYear().toString().substring(2),yyyy:date.getUTCFullYear()};val.dd=(val.d<10?"0":"")+val.d,val.mm=(val.m<10?"0":"")+val.m,date=[];for(var seps=$.extend([],format.separators),i=0,cnt=format.parts.length;cnt>=i;i++)seps.length&&date.push(seps.shift()),date.push(val[format.parts[i]]);return date.join("")},headTemplate:'<thead><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};DPGlobal.template='<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">'+DPGlobal.headTemplate+"<tbody></tbody>"+DPGlobal.footTemplate+'</table></div><div class="datepicker-months"><table class="table-condensed">'+DPGlobal.headTemplate+DPGlobal.contTemplate+DPGlobal.footTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+DPGlobal.headTemplate+DPGlobal.contTemplate+DPGlobal.footTemplate+"</table></div></div>",$.fn.datepicker.DPGlobal=DPGlobal,$.fn.datepicker.noConflict=function(){return $.fn.datepicker=old,this},$(document).on("focus.datepicker.data-api click.datepicker.data-api",'[data-provide="datepicker"]',function(e){var $this=$(this);$this.data("datepicker")||(e.preventDefault(),$this.datepicker("show"))}),$(function(){$('[data-provide="datepicker-inline"]').datepicker()})}(window.jQuery);