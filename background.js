(function () {
    var ts = 0;
    var Lookup = function(message, targetLanguage, callback, sendResponse) {
        var xhr_ts = ++ts;
        var xhr = new XMLHttpRequest();
        // sl in url is known as source language; sl in code is known as secondary language
        var url = 'http://translate.google.com.tw/translate_a/single?client=t&';
        url += 'sl=auto&';
        url += 'tl=' + targetLanguage + '&';
        url += 'dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&'
        url += 'q=' + encodeURIComponent(message);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                if(xhr_ts === ts) {
                    var result = Sanitized(xhr.responseText);
                    console.log(result);
                    if(result.translate === message) {
                        if(targetLanguage === localStorage['pl']) {
                            Lookup(message, localStorage['sl'], callback, sendResponse);
                            return;
                        }
                        else result.translate = 'Oops! No translation data...';
                    }
                    callback(result, sendResponse);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    };
    var Sanitized = function(message) {
        console.log(message);
        while(message.match(/,,/)) message = message.replace(/,,/g, ',false,');
        while(message.match(/\[,/)) message = message.replace(/\[,/g, '[false,');
        message = JSON.parse(message);
        var ret = {
            translate: null, 
            words: null
        };
        if(typeof message[0][0] === 'object' && typeof message[0][0][0] === 'string') ret.translate = message[0][0][0];
        if(typeof message[1] === 'object') ret.words = message[1];
        return ret;
    };
    var SendPopup = function(message, sendResponse) { // for type: pp
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
    var SendWebpage = function(message, sendResponse) { // for type: wp
        sendResponse(message);
    };
    var ReceiveMessage = function(message, sender, sendResponse) {
        console.log('lookup: "' + message.lookup + '" from: ' + message.type);
        if(message.type === 'pp') Lookup(message.lookup, localStorage['pl'], SendPopup, sendResponse);
        else if(message.type === 'wp') Lookup(message.lookup, localStorage['pl'], SendWebpage, sendResponse);
        return true;
    };
    chrome.extension.onMessage.addListener(ReceiveMessage);
})();
