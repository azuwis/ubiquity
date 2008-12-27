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
    var contianer = CmdUtils.getDocument().getElementById('slidePlaylist');
    var li = contianer.getElementsByTagName('li');
    var list = "";
    for(var i = 0, count = li.length; i < count; ++i) {
      var iid = li[i].id.substring(8);
      jQuery.ajax({
        url: 'http://v2.tudou.com/v2/cdn?id=' + iid,
        async: false,
        success: function(data){
          var rslt = jQuery(data).find("v");
          list = list + rslt.find("f").eq(0).text() + "\n" + "  out=" + rslt.attr("title") + "\n";
        }
      });
    }
    CmdUtils.copyToClipboard(list);
    pblock.innerHTML = "Working...Success! Copied to clipboard.";
    //pblock.innerHTML = CmdUtils.renderTemplate(template, {"name": "World!"});
  },
  execute: function(input) {
    CmdUtils.setSelection("You selected: "+input.html);
  }
});
