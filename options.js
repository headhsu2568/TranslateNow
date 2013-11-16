(function () {
	var save_btn = document.getElementById('save');
	var reload_btn = document.getElementById('reload');
	var dictionary_btn = document.getElementById('dictionary');
	var default_btn = document.getElementById('default');
	var sl = document.getElementById('sl');
	var tl = document.getElementById('tl');
	var Save = function() {
		localStorage['sl'] = sl.value;
		localStorage['tl'] = tl.value;
		Dictionary();
	};
	var Reload = function() {
		document.getElementById('sl-' + localStorage['sl']).selected = true;
		document.getElementById('tl-' + localStorage['tl']).selected = true;
	};
	var Dictionary = function() {
		window.location = 'page_action.html';
	};
	var Default = function() {
		localStorage['sl'] = 'auto';
		localStorage['tl'] = 'zh-TW';
		Reload();
	};
	Reload();
	save_btn.addEventListener('click', Save);
	reload_btn.addEventListener('click', Reload);
	dictionary_btn.addEventListener('click', Dictionary);
	default_btn.addEventListener('click', Default);
})();