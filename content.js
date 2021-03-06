(function () {
	var flag = 0;
	var lookup = null;
	var Keydown = function(key) {
		if(key.keyCode === 18 && flag === 0) flag = 1;
		else if(key.keyCode === 27) ClearLookupResult();
	};
	var Keyup = function(key) {
		lookup = window.getSelection();
		if(key.keyCode === 18 && flag === 1) {
			flag = 0;
			if(lookup !== '') {
				var json = {
					type: 'wp', 
					lookup: lookup.toString()
				};
				chrome.extension.sendMessage(null, json, HandleLookupResult);
			}
		}
	};
	var GetCoordination = function(element) {
		var cor = {top: 0, left: 0, height: 0, width: 0};
		cor.height = element.offsetHeight;
		cor.width = element.offsetWidth;
		while(element !== null && element !== document.body) {
			cor.top += element.offsetTop;
			cor.left += element.offsetLeft;
			element = element.offsetParent;
		}
		cor.top += document.body.offsetTop;
		cor.left += document.body.offsetLeft;
		return cor;
	};
	var ClearLookupResult = function() {
		var lookup_target = document.getElementById('lookup-target');
		if(lookup_target !== null) lookup_target.outerHTML = lookup_target.innerHTML;
		var lookup_result = document.getElementById('lookup-result');
		if(lookup_result !== null && lookup_result.parentElement) lookup_result.parentElement.removeChild(lookup_result);
		var style = document.getElementById('lookup-result-css');
		if(style !== null && style.parentElement) style.parentElement.removeChild(style);
	};
	var HandleLookupResult = function(message) {
		if(lookup.type === 'Range') {
			ClearLookupResult();
			var range = lookup.getRangeAt(0);
			var lookup_target = document.createElement('span');
			lookup_target.id = 'lookup-target';
			lookup_target.innerHTML = range.toString();
			range.extractContents();
			range.insertNode(lookup_target);

			var cor = GetCoordination(lookup_target);
			var top_offset = cor.top + cor.height + 10;
			var left_offset = cor.left + cor.width/2 - 50;
			var style = document.createElement('style');
			style.id = 'lookup-result-css';
			style.innerHTML = '.lookup-result {' +
									'text-align: left;' + 
									'min-width: 250px;' + 
									'max-width: 250px;' +
									'min-height: 65px;' + 
									'max-height: 65px;' + 
									'font-size: 16px;' + 
									'position: absolute;' + 
									'border: solid 1px #ffa500;' + 
									'background-color: #fffacd;' + 
									'padding-left: 10px;' + 
									'padding-right: 5px;' + 
									'padding-top: 10px;' + 
									'padding-bottom: 5px;' + 
									'z-index: 2568;' + 
									'top: ' + top_offset + 'px;' + 
									'left: ' + left_offset + 'px;' + 
								'}' + 
								'.lookup-result .arrow {' + 
									'width: 0px;' + 
									'height: 0px;' + 
									'border-width: 10px;' + 
									'border-style: solid;' + 
									'border-color: transparent transparent #ffa500 transparent;' + 
									'position: absolute;' + 
									'top: -20px;' + 
									'left: 40px;' + 
								'}' + 
								'.lookup-result .border {' +
									'width: 0px;' + 
									'height: 0px;' + 
									'border-width: 10px;' + 
									'border-style: solid;' + 
									'border-color: transparent transparent #fffacd transparent;' +
									'position: absolute;' + 
									'top: -19px;' +
									'left: 40px;' +
								'}' + 
								'.lookup-result .close {' + 
									'position: absolute;' + 
									'right: 5px;' + 
									'top: 5px;' + 
									'min-width: 13px;' + 
									'max-width: 13px;' + 
									'min-height: 13px;' + 
									'max-height: 13px;' + 
									'background: url(' + chrome.extension.getURL('icons/glyphicons-halflings.png') + ') -312px 0px;' + 
									'cursor: pointer;' + 
									'border: none;' + 
								'}';
			var firstNode = document.body.firstChild;
			document.body.insertBefore(style, firstNode);

			var lookup_result = document.createElement('div');
			lookup_result.id = 'lookup-result';
			lookup_result.className = 'lookup-result';
			var close = document.createElement('button');
			close.className = 'close';
			close.id = 'lookup-result-close';
			var arrow = document.createElement('span');
			arrow.className = 'arrow';
			var border = document.createElement('span');
			border.className = 'border';
			lookup_result.appendChild(close);
            lookup_result.appendChild(arrow);
            lookup_result.appendChild(border);
			lookup_result.innerHTML += message.translate;
            document.body.insertBefore(lookup_result, firstNode);
            close = document.getElementById('lookup-result-close');
            close.addEventListener('click', ClearLookupResult, false);
		}
	};
	window.addEventListener('keyup', Keyup);
	window.addEventListener('keydown', Keydown);
})();