CmdUtils.CreateCommand({
    name: "dictcn",
    author: {
        name: "Hu Ziming",
        email: "hzmangel@gmail.com"
    },
    contributors: ["Hu Ziming"],
    description: "Consulting the word from <a>http://dict.cn</a>.",
    icon : "http://dict.cn/favicon.ico",
    help: "Consulting the word from <a>http://dict.cn</a>.",
    takes: {
        "eng_word": noun_arb_text
    },
    license: "MPL",
    preview: function( pblock, direct_obj){
        var eng_word = direct_obj.text;
        var url = "http://dict.cn/ws.php?q=";
        url += eng_word;

        var pre_template = "<style> #container {background-color: #73bFE6;} #word {font-family: arial black; color: maroon;font-size: x-large;} #explanation {color: midnightblue; font-size: medium; font-family: tahoma;padding:3px;} #sent {color: maroon;} .orig {background-color: #B6C5F2; margin: 1px 0; color: firebrick;} .trans {background-color: #2D4488; color: white; margin: 1px 0;} </style> <div id=\"container\"> <div id=\"word\">${w.word} (${w.prons})</div> <div id=\"explanation\">${w.def}</div>{for foo in w.sents}<div id=\"sent\"> <div class=\"orig\">${foo.orig}</div> <div class=\"trans\">${foo.trans}</div> </div> </div>{/for}";

        if(eng_word.length < 3){
            pblock.innerHTML = "Need at lest 3 chars."
        } else {
        jQuery.get(url, function(data){
            var rslt = jQuery(data).find("dict");
          
            //pblock.innerHTML = rslt.find("sent").slice(0).find("orig").text();
            //CmdUtils.log(rslt.find("sent > orig").slice(1).text());
         
            var sents = rslt.find("sent").map(function(){
                return {
                    orig : jQuery("orig", this).text(),
                    trans : jQuery("trans", this).text()
                }
            });
            
            var foobar = {
                word  : rslt.find("key").text(),
                prons : rslt.find("pron").text(),
                def   : rslt.find("def").text(),
                sents : sents
            };

            pblock.innerHTML = CmdUtils.renderTemplate(pre_template, {
                w:foobar
            });

        }, "xml");
        }
    },

    execute: function( direct_obj ){
        var eng_word = direct_obj.text;
        var url = "http://dict.cn/";
        url += eng_word;
        Utils.openUrlInBrowser( url );
    }

});

CmdUtils.__globalObject["cmd_dcn"] = CmdUtils.__globalObject["cmd_dictcn"];
