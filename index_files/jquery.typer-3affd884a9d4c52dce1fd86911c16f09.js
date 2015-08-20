String.prototype.rightChars=function(n){return 0>=n?"":n>this.length?this:this.substring(this.length,this.length-n)},function($){var highlight,clearText,type,spanWithColor,clearDelay,typeDelay,clearData,isNumber,typeWithAttribute,getHighlightInterval,getTypeInterval,typerInterval,options={highlightSpeed:30,typeSpeed:100,clearDelay:500,typeDelay:200,clearOnHighlight:!0,typerDataAttr:"data-typer-targets",typerInterval:2e3};spanWithColor=function(color,backgroundColor){return"rgba(0, 0, 0, 0)"===color&&(color="rgb(255, 255, 255)"),$("<span></span>").css("color",color).css("background-color",backgroundColor)},isNumber=function(n){return!isNaN(parseFloat(n))&&isFinite(n)},clearData=function($e){$e.removeData(["typePosition","highlightPosition","leftStop","rightStop","primaryColor","backgroundColor","text","typing"])},type=function($e){var text=$e.data("text"),oldLeft=$e.data("oldLeft"),oldRight=$e.data("oldRight");return text&&0!==text.length?($e.text(oldLeft+text.charAt(0)+oldRight).data({oldLeft:oldLeft+text.charAt(0),text:text.substring(1)}),void setTimeout(function(){type($e)},getTypeInterval())):void clearData($e)},clearText=function($e){$e.find("span").remove(),setTimeout(function(){type($e)},typeDelay())},highlight=function($e){var leftText,highlightedText,rightText,position=$e.data("highlightPosition");return isNumber(position)||(position=$e.data("rightStop")+1),position<=$e.data("leftStop")?void setTimeout(function(){clearText($e)},clearDelay()):(leftText=$e.text().substring(0,position-1),highlightedText=$e.text().substring(position-1,$e.data("rightStop")+1),rightText=$e.text().substring($e.data("rightStop")+1),$e.html(leftText).append(spanWithColor($e.data("primaryColor"),$e.data("backgroundColor")).append(highlightedText)).append(rightText),$e.data("highlightPosition",position-1),void setTimeout(function(){return highlight($e)},getHighlightInterval()))},typeWithAttribute=function($e){var targets;if(!$e.data("typing")){try{targets=JSON.parse($e.attr($.typer.options.typerDataAttr)).targets}catch(e){}"undefined"==typeof targets&&(targets=$.map($e.attr($.typer.options.typerDataAttr).split(","),function(e){return $.trim(e)})),$e.typeTo(targets[Math.floor(Math.random()*targets.length)])}},$.typer=function(){return{options:options}}(),$.extend($.typer,{options:options}),$.fn.typer=function(){var $elements=$(this);return $elements.each(function(){var $e=$(this);"undefined"!=typeof $e.attr($.typer.options.typerDataAttr)&&(typeWithAttribute($e),setInterval(function(){typeWithAttribute($e)},typerInterval()))})},$.fn.typeTo=function(newString){var $e=$(this),currentText=$e.text(),i=0,j=0;if(currentText===newString)return console.log("Our strings our equal, nothing to type"),$e;if(currentText!==$e.html())return console.error("Typer does not work on elements with child elements."),$e;for($e.data("typing",!0);currentText.charAt(i)===newString.charAt(i);)i++;for(;currentText.rightChars(j)===newString.rightChars(j);)j++;return newString=newString.substring(i,newString.length-j+1),$e.data({oldLeft:currentText.substring(0,i),oldRight:currentText.rightChars(j-1),leftStop:i,rightStop:currentText.length-j,primaryColor:$e.data("color")||$e.css("color"),backgroundColor:$e.data("background-color")||$e.css("background-color"),text:newString}),highlight($e),$e},getHighlightInterval=function(){return $.typer.options.highlightSpeed},getTypeInterval=function(){return $.typer.options.typeSpeed},clearDelay=function(){return $.typer.options.clearDelay},typeDelay=function(){return $.typer.options.typeDelay},typerInterval=function(){return $.typer.options.typerInterval}}(jQuery);