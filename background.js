(function () {
    var ts = 0;
    var Lookup = function(message, callback, sendResponse) {
        var xhr_ts = ++ts;
        var xhr = new XMLHttpRequest();
        var url = 'http://translate.google.com.tw/translate_a/t?client=t&sl=auto&tl=zh-TW&hl=zh-TW&sc=2&ie=UTF-8&oe=UTF-8&oc=2&prev=btn&ssel=0&tsel=0&q=';
        url += encodeURIComponent(message);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                if(xhr_ts === ts) callback(Sanitized(xhr.responseText), sendResponse);
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    };
    var Sanitized = function(message) {
        while(message.match(/,,/)) message = message.replace(/,,/g, ',false,');
        message = JSON.parse(message);
        var ret = {
            translate: null, 
            words: null
        };
        if(typeof message[0][0] === 'object' && typeof message[0][0][0] === 'string') ret.translate = message[0][0][0];
        if(typeof message[1] === 'object') ret.words = message[1];
        return ret;
    };
    var SendPopup = function(message, sendResponse) {
        var views = chrome.extension.getViews({
            type: 'popup'
        });
        if(typeof views === 'object' && typeof views[0] !== 'undefined') {
            var res = views[0].document.getElementById('lookup-result');
            res.textContent = '';
            var translate_div = document.createElement('div');
            translate_div.className = 'translate';
            translate_div.textContent = message.translate;
            res.appendChild(translate_div);
            if(message.words) {
                var words = document.createElement('div');
                words.className = 'words';
                for(var i in message.words) {
                    if(i > 0) words.appendChild(document.createElement('br'));
                    var type = document.createElement('div');
                    type.className = 'word-type';
                    type.textContent = message.words[i][0];
                    words.appendChild(type);
                    for(var j in message.words[i][2]) {
                        var mean = document.createElement('div');
                        mean.className = 'word-mean';
                        mean.textContent = message.words[i][2][j][0];
                        words.appendChild(mean);
                        var like = document.createElement('div');
                        like.className = 'word-like';
                        like.textContent = JSON.stringify(message.words[i][2][j][1]).replace(/[\[\]{}"]/g, '').replace(/,/g, ', ');
                        words.appendChild(like);
                    }
                }
                res.appendChild(words);
            }
        }
    };
    var SendWebpage = function(message, sendResponse) {
        sendResponse(message);
    };
    var ReceiveMessage = function(message, sender, sendResponse) {
        console.log('lookup: "' + message.lookup + '" from: ' + message.type);
        if(message.type === 'pp') Lookup(message.lookup, SendPopup, sendResponse);
        else if(message.type === 'wp') Lookup(message.lookup, SendWebpage, sendResponse);
        return true;
    };
    chrome.extension.onMessage.addListener(ReceiveMessage);
})();