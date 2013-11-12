(function () {
	var query_field = null;
    var btn = null;
    var lookup_result = null;
    var ClickLookup = function() {
    	console.log('Lookup: ' + query_field.value);
    	var json = {
    		type: 'pp', 
    		lookup: query_field.value
    	};
    	chrome.extension.sendMessage(null, json);
    };
    var CheckKey = function(key) {
    	if(key.keyCode === 13) ClickLookup();
    };
    query_field = document.getElementById('query-field');
    btn = document.getElementById('button');
    lookup_result = document.getElementById('lookup_result');
    query_field.focus();
    btn.addEventListener('click', ClickLookup, false);
    query_field.addEventListener('keydown', CheckKey, false);
})();