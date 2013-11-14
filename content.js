(function () {
	var flag = 0;
	var lookup = null;
	var Keydown = function(key) {
		if(key.keyCode === 18 && flag === 0) flag = 1;
	}
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
	var getCoordination = function(element) {
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
	}
	var HandleLookupResult = function(message) {
		if(lookup.type === 'Range') {
			var lookup_target = document.getElementById('lookup-target');
			if(lookup_target !== null) lookup_target.outerHTML = lookup_target.innerHTML;
			var lookup_result = document.getElementById('lookup-result');
			if(lookup_result !== null && lookup_result.parentElement) lookup_result.parentElement.removeChild(lookup_result);
			var style = document.getElementById('lookup-result-css');
			if(style !== null && style.parentElement) style.parentElement.removeChild(style);

			var range = lookup.getRangeAt(0);
			lookup_target = document.createElement('span');
			lookup_target.id = 'lookup-target';
			lookup_target.innerHTML = range.toString();
			range.extractContents();
			range.insertNode(lookup_target);

			var cor = getCoordination(lookup_target);
			var top_offset = cor.top + cor.height + 10;
			var left_offset = cor.left + cor.width/2 - 50;
			style = document.createElement('style');
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
									'padding-left: 12px;' + 
									'padding-top: 12px;' + 
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
								'}';
			var firstNode = document.body.firstChild;
			document.body.insertBefore(style, firstNode);

			lookup_result = document.createElement('div');
			lookup_result.id = 'lookup-result';
			lookup_result.className = 'lookup-result';
			var arrow = document.createElement('span');
			arrow.className = 'arrow';
			var border = document.createElement('span');
			border.className = 'border';
            lookup_result.appendChild(arrow);
            lookup_result.appendChild(border);
			lookup_result.innerHTML += message.translate;
            document.body.insertBefore(lookup_result, firstNode);
		}
	};
	window.addEventListener('keyup', Keyup);
	window.addEventListener('keydown', Keydown);
})();