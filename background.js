(function () {
    var ts = 0;
    var Lookup = function(message, callback) {
        // http://translate.google.com.tw/translate_a/t?client=t&sl=en&tl=zh-TW&hl=zh-TW&sc=2&ie=UTF-8&oe=UTF-8&oc=2&prev=btn&ssel=0&tsel=0&q=apple
        // [[["蘋果","apple","Píngguǒ",""]],[["名詞",["蘋果","蘋"],[["蘋果",["apple"],,0.645648539],["蘋",["apple"],,0.00280879415]],"apple",1]],"en",,[["蘋果",[4],0,0,1000,0,1,0]],[["apple",4,[["蘋果",1000,0,0],["蘋果公司",0,0,0],["的蘋果",0,0,0],["蘋果的",0,0,0],["蘋",0,0,0]],[[0,5]],"apple"]],,,[],21]
        // http://translate.google.com.tw/translate_a/t?client=t&sl=en&tl=zh-TW&hl=zh-TW&sc=2&ie=UTF-8&oe=UTF-8&oc=2&prev=btn&ssel=0&tsel=0&q=test
        /* [
            [
                ["測試","test","Cèshì",""]
            ],
            [
                [   "名詞",
                    ["測試","試驗","試","實驗","考試","考驗","測驗"],
                    [
                        ["測試",["test","examination"],,0.606530666],
                        ["試驗",["test","experiment","tentative"],,0.212912291],
                        ["試",["test","examination","experiment","exam","fitting"],,0.0164180323],
                        ["實驗",["experiment","test"],,0.0147170294],
                        ["考試",["examination","exam","test"],,0.01382537],
                        ["考驗",["test","trial","ordeal"],,0.013611027],
                        ["測驗",["test","quiz"],,0.0114616342]
                    ],
                    "test",
                    1
                ],
                [   "動詞",
                    ["檢驗","試","測驗","考","驗","考查","嘗"],
                    [
                        ["檢驗",["test","examine","inspect"],,0.046045512],
                        ["試",["test","try"],,0.0164180323],
                        ["測驗",["test","put to test"],,0.0114616342],
                        ["考",["test","study","examine","investigate","verify","check"],,0.00402341178],
                        ["驗",["test","check","verify","examine","prove","confirm"],,0.00115272682],
                        ["考查",["test","investigate","check","study"],,0.00041101739],
                        ["嘗",["taste","flavor","try the flavor","test","flavour"],,1.20986715e-06]
                    ],
                    "test",
                    2
                ]
            ],
            "en",,[["測試",[4],0,0,1000,0,1,0]],[["test",4,[["測試",1000,0,0],["試驗",0,0,0],["檢驗",0,0,0],["試",0,0,0],["考驗",0,0,0]],[[0,4]],"test"]],,,[],22]
        */
        // http://translate.google.com.tw/translate_a/t?client=t&sl=en&tl=zh-TW&hl=zh-TW&sc=2&ie=UTF-8&oe=UTF-8&oc=4&prev=btn&ssel=0&tsel=0&q=apple%20is%20good
        // [[["蘋果是好的","apple is good","Píngguǒ shì hǎo de",""]],,"en",,[["蘋果",[4],0,0,1000,0,1,0],["是",[5],0,0,1000,1,2,0],["好的",[6],0,0,1000,2,3,0]],[["apple",4,[["蘋果",1000,0,0],["蘋果公司",0,0,0],["的蘋果",0,0,0],["蘋果的",0,0,0],["蘋果電腦",0,0,0]],[[0,5]],"apple is good"],["is",5,[["是",1000,0,0],["為",0,0,0],["的",0,0,0],["就是",0,0,0],["的是",0,0,0]],[[6,8]],""],["good",6,[["好的",1000,0,0],["好",0,0,0],["良好",0,0,0],["良好的",0,0,0],["很好的",0,0,0]],[[9,13]],""]],,,[["en"]],40]
        var xhr_ts = ++ts;
        var xhr = new XMLHttpRequest();
        var url = 'http://translate.google.com.tw/translate_a/t?client=t&sl=en&tl=zh-TW&hl=zh-TW&sc=2&ie=UTF-8&oe=UTF-8&oc=2&prev=btn&ssel=0&tsel=0&q=';
        url += encodeURIComponent(message);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                console.log('no: ' + xhr_ts);
                console.log(xhr.responseText);
                if(xhr_ts === ts) callback(xhr.responseText);
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    };
    var SendPopup = function(message) {
        var views = chrome.extension.getViews({
            type: 'popup'
        });
        var w = null;
        if(typeof views === 'object' && typeof views[0] !== 'undefined') w = views[0];
        var res = w.document.getElementById('lookup-result');
        while(message.match(/,,/)) message = message.replace(/,,/g, ',false,');
        message = JSON.parse(message);
    }
    var ReceiveMessage = function(message, sender) {
        console.log('lookup: "' + message.lookup + '" from: ' + message.type);
        if(message.type === 'pp') Lookup(message.lookup, SendPopup);
    };
    chrome.extension.onMessage.addListener(ReceiveMessage);
})();