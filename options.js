(function () {
	var save_btn = document.getElementById('save');
	var reload_btn = document.getElementById('reload');
	var sl = document.getElementById('sl');
	var tl = document.getElementById('tl');
	var Save = function() {
		localStorage['sl'] = sl.value;
		localStorage['tl'] = tl.value;
		window.location = 'page_action.html';
	};
	var Reload = function() {
		document.getElementById('sl-' + localStorage['sl']).selected = true;
		document.getElementById('tl-' + localStorage['tl']).selected = true;
	};
	Reload();
	save_btn.addEventListener('click', Save);
	reload_btn.addEventListener('click', Reload);
})();