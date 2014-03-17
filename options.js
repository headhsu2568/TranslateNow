(function () {
	var save_btn = document.getElementById('save');
	var reload_btn = document.getElementById('reload');
	var dictionary_btn = document.getElementById('dictionary');
	var default_btn = document.getElementById('default');
	var pl = document.getElementById('pl');
	var sl = document.getElementById('sl');
	var Save = function() {
		localStorage['pl'] = pl.value;
		localStorage['sl'] = sl.value;
		Dictionary();
	};
	var Reload = function() {
		pl.value = localStorage['pl'];
		sl.value = localStorage['sl'];
	};
	var Dictionary = function() {
		window.location = 'page_action.html';
	};
	var Default = function() {
		localStorage['pl'] = 'zh-TW';
		localStorage['sl'] = 'en';
		Reload();
	};
	Reload();
	save_btn.addEventListener('click', Save);
	reload_btn.addEventListener('click', Reload);
	dictionary_btn.addEventListener('click', Dictionary);
	default_btn.addEventListener('click', Default);
})();