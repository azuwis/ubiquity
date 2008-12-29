CmdUtils.CreateCommand({
    name: "getvideo",
    icon: "http://www.tudou.com/favicon.ico",
    homepage: "http://vi.appspot.com/",
    author: {
        name: "azuwis",
        email: "azuwis@gmail.com"
    },
    license: "GPL",
    description: "Tudou download list",
    help: "Just preview the command, download list will be copied to clipboard when success.",
    //takes: {"input": noun_arb_text},
    _handleTudouPlaylist: function(pblock, doc) {
        pblock.innerHTML = "Working...";
        var iidDoc = jQuery(doc).find("div#slidePlaylist li");
        var iidMax = iidDoc.length;
        var list = [];
        iidDoc.each(function(i) {
            var iid = this.id.substring(8);
            jQuery.ajax({
                url: 'http://v2.tudou.com/v2/cdn?id=' + iid,
                async: false,
                success: function(data) {
                    var rslt = jQuery(data).find("v");
                    list[i] = {
                        url: rslt.find("f").eq(0).text(),
                        title: rslt.attr("title")
                    };
                }
            });
            pblock.innerHTML = "Working..." + i + "/" + iidMax;
        });
        return list;
    },
    preview: function(pblock, input) {
        var doc = CmdUtils.getDocument();
        var uri = Utils.url(doc.documentURI);
        var list = [];
        if (uri.spec.match("http://www.tudou.com/playlist/playindex.do")) {
            list = this._handleTudouPlaylist(pblock, doc);
        } else {
            pblock.innerHTML = "Preview this command in tudou playlist page.";
            return;
        }
        var ariaList = "";
        jQuery.each(list,
        function() {
            ariaList += this.url + "\n" + "  out=" + this.title + ".flv\n";
        });
        CmdUtils.copyToClipboard(ariaList);
        pblock.innerHTML = "Working...Done! " + list.length + " items copied to clipboard.";
    },
    execute: function(input) {
        CmdUtils.setSelection("You selected: " + input.html);
    }
});
