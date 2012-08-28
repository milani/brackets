var app  = require('appjs')
  , fs   = require('fs')
  , path = require('path');

process.title = "Brackets";

var home = path.resolve(__dirname,'src/index.html');

app.serveFilesFrom(__dirname+'/src');

var openNewWindow = function(location) {
  var window = app.createWindow({
    icons: __dirname+'/src/styles/images/icons',
    url:location
  });
  window.on('create',function(){
    this.frame.show();
  });
  window.on('ready',function(){

    var document = window.document;
    window.process = process;
    window.fs = fs;
    window.Path = path;
    window.frame.console = console;
    window.__dirname = path.resolve(__dirname,'src','file');
    window.app = app;
    window.openNewWindow = openNewWindow;
    var appshellScript = document.createElement('script');
    appshellScript.src = 'appshell.js';
    document.body.appendChild(appshellScript);
    var requireScript = document.createElement('script');
    requireScript.src = 'thirdparty/require.js';
    requireScript.setAttribute('data-main','brackets');
    document.body.appendChild(requireScript);
  });
}

openNewWindow('http://appjs/');
