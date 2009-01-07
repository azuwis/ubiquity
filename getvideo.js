noun_type_downloadlist = new CmdUtils.NounType("DownloadList", ["aria2", "html"], "aria2");

CmdUtils.CreateCommand({
    name: "getvideo",
    icon: "http://www.adobe.com/images/shared/product_mnemonics/50x50/flash_player_50x50.gif",
    homepage: "http://vi.appspot.com/",
    author: {
        name: "azuwis",
        email: "azuwis@gmail.com"
    },
    license: "GPL",
    description: "Get media urls",
    help: "Just preview the command, media urls will be copied to clipboard when success.",
    takes: {
        "download list type": noun_type_downloadlist
    },
    _data: {},
    _getTodouFLVFromIID: function(iid, hd) {
        var url;
        if (hd) {
            url = 'http://v2.tudou.com/v2/kili?id=';
        } else {
            url = 'http://v2.tudou.com/v2/cdn?id=';
        }
        var list;
        jQuery.ajax({
            url: url + iid,
            async: false,
            success: function(data) {
                var rslt = jQuery(data).find("v");
                list = {
                    url: rslt.find("f").map(function() {
                        return jQuery(this).text();
                    }).get(),
                    title: rslt.attr("title")
                };
            }
        });
        return list;
    },
    _handleTudouPlaylist: function(pblock, doc) {
        pblock.innerHTML = "Working...";
        var iidDoc = jQuery(doc).find("div#slidePlaylist li");
        var iidMax = iidDoc.length;
        var list = [];
        var upthis = this;
        iidDoc.each(function(i) {
            var iid = this.id.substring(8);
            list[i] = upthis._getTodouFLVFromIID(iid);
            pblock.innerHTML = "Working..." + (i + 1) + "/" + iidMax;
        });
        return list;
    },
    _handleTudouHDPlaylist: function(pblock, doc) {
        pblock.innerHTML = "Working...";
        var uri = Utils.url(doc.documentURI);
        var videoId = uri.spec.match(/program\/(\d+)\//)[1];
        var list = [];
        var upthis = this;
        var pageDoc = jQuery(doc).find("div#edList div.pagebox li")
        var pageMax = pageDoc.length;
        pageDoc.each(function(i) {
            jQuery.ajax({
                url: "http://hd.tudou.com/ajax/albumVideos.html?videoId=" + videoId + "&pageNumer=" + (i + 1),
                async: false,
                success: function(data) {
                    var urlDoc = jQuery(data).find("a.mylist_hook");
                    var urlMax = urlDoc.length;
                    urlDoc.each(function(j) {
                        var url = "http://hd.tudou.com" + jQuery(this).attr("href");
                        jQuery.ajax({
                            url: url,
                            async: false,
                            success: function(data){
                                var index = i * 10 + j;
                                var iid = data.match(/\siid:\s*"(\d+)",/)[1];
                                list[index] = upthis._getTodouFLVFromIID(iid, true);
                                pblock.innerHTML = "Working..." + (index + 1) + "/" + (pageMax * 10 - 10 + urlMax);
                            }
                        });
                    });
                }
            });
        });
        return list;
    },
    _handleTudouSingleVideo: function(pblock, doc) {
        var iid = jQuery(doc).find("div.shareButton a").attr("href").match(/iid=(\d+)/)[1];
        pblock.innerHTML = "Working...";
        var list = this._getTodouFLVFromIID(iid);
        pblock.innerHTML += "<br/><br/>Title: " + list.title + "<br/>Urls:<br/>" + list.url.join("<br/>") + "<br/>";
        return [list];
    },
    _genAriaList: function(list) {
        return jQuery.map(list,
        function(item) {
            return item.url.join("\t") + "\n" + "  out=" + item.title + ".flv";
        }).join("\n");
    },
    _genHTMLList: function(list) {
        var tmpl = "{for i in l}<a href='${i.url[0]}'>${i.title}.flv</a><br/>\n{/for}\n";
        return CmdUtils.renderTemplate(tmpl, {
            l: list
        });
    },
    preview: function(pblock, input) {
        var downloadListType = input.text;
        var doc = CmdUtils.getDocument();
        var uri = Utils.url(doc.documentURI);
        if (uri.spec.match("http://www.tudou.com/playlist/playindex.do")) {
            this._data.list = this._handleTudouPlaylist(pblock, doc);
        } else if (uri.spec.match("http://www.tudou.com/programs/view/")) {
            this._data.list = this._handleTudouSingleVideo(pblock, doc);
        } else if (uri.spec.match("http://hd.tudou.com/program/")) {
            this._data.list = this._handleTudouHDPlaylist(pblock, doc);
        } else {
            pblock.innerHTML = "Preview this command in tudou playlist page.";
            return;
        }
        if (downloadListType == "aria2") {
            CmdUtils.copyToClipboard(this._genAriaList(this._data.list));
            pblock.innerHTML += "<br/>Done! " + this._data.list.length + " items copied to clipboard." + "<br/><br/>Press <b>Enter</b> will:<ul><li>Modify this page with download links, for download manager such as DownloadThemAll, Flashgot, if there're multiple media.</li><li>Open the media url in new tab, if there is only one media.</li></ul>";
        }
    },
    execute: function(input) {
        var doc = CmdUtils.getDocument();
        if (this._data.list.length == 1) {
            Utils.openUrlInBrowser(this._data.list[0].url[0]);
        } else {
            jQuery(doc).find("html").html(this._genHTMLList(this._data.list));
        }
    }
});
