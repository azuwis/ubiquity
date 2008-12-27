CmdUtils.CreateCommand({
  name: "tudou",
  icon: "http://www.tudou.com/favicon.ico",
  homepage: "http://vi.appspot.com/",
  author: { name: "azuwis", email: "azuwis@gmail.com"},
  license: "GPL",
  description: "Tudou download list",
  help: "Just preview the command, download list will be copied to clipboard when success.",
  //takes: {"input": noun_arb_text},
  preview: function( pblock, input ) {
    //var template = "Hello ${name}";
    pblock.innerHTML = "Working...";
    var list = [];
    jQuery(CmdUtils.getDocument()).find("div#slidePlaylist li").each(function(i){
      var iid = this.id.substring(8);
      jQuery.ajax({
        url: 'http://v2.tudou.com/v2/cdn?id=' + iid,
        async: false,
        success: function(data){
          var rslt = jQuery(data).find("v");
          list[i] = {
            url: rslt.find("f").eq(0).text(),
            title: rslt.attr("title"),
          };
        },
      });
    });
    var ariaList = "";
    jQuery.each(list, function(){
      ariaList = ariaList + this.url + "\n" + "  out=" + this.title + ".flv\n"
    });
    CmdUtils.copyToClipboard(ariaList);
    pblock.innerHTML = "Working...Success! " + list.length + " items copied to clipboard.";
    //pblock.innerHTML = CmdUtils.renderTemplate(template, {"name": "World!"});
  },
  execute: function(input) {
    CmdUtils.setSelection("You selected: "+input.html);
  }
});
