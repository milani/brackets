// This is the JavaScript code for bridging to native functionality
// with AppJS. 

/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, indent: 4, forin: true, maxerr: 50, regexp: true */
/*global define, native */

var appshell;
if (!appshell) {
    appshell = {};
}
if (!appshell.fs) {
    appshell.fs = {};
}
if (!appshell.app) {
    appshell.app = {};
}

// Error values. These MUST be in sync with the error values
// at the top of appshell_extensions_platform.h.

/**
 * @constant No error.
 */
appshell.fs.NO_ERROR                    = 0;

/**
 * @constant Unknown error occurred.
 */
appshell.fs.ERR_UNKNOWN                 = 1;

/**
 * @constant Invalid parameters passed to function.
 */
appshell.fs.ERR_INVALID_PARAMS          = 2;

/**
 * @constant File or directory was not found.
 */
appshell.fs.ERR_NOT_FOUND               = 3;

/**
 * @constant File or directory could not be read.
 */
appshell.fs.ERR_CANT_READ               = 4;

/**
 * @constant An unsupported encoding value was specified.
 */
appshell.fs.ERR_UNSUPPORTED_ENCODING    = 5;

/**
 * @constant File could not be written.
 */
appshell.fs.ERR_CANT_WRITE              = 6;

/**
 * @constant Target directory is out of space. File could not be written.
 */
appshell.fs.ERR_OUT_OF_SPACE            = 7;

/**
 * @constant Specified path does not point to a file.
 */
appshell.fs.ERR_NOT_FILE                = 8;

/**
 * @constant Specified path does not point to a directory.
 */
appshell.fs.ERR_NOT_DIRECTORY           = 9;

/**
 * Display the OS File Open dialog, allowing the user to select
 * files or directories.
 *
 * @param {boolean} allowMultipleSelection If true, multiple files/directories can be selected.
 * @param {boolean} chooseDirectory If true, only directories can be selected. If false, only 
 *        files can be selected.
 * @param {string} title Tile of the open dialog.
 * @param {string} initialPath Initial path to display in the dialog. Pass NULL or "" to 
 *        display the last path chosen.
 * @param {Array.<string>} fileTypes Array of strings specifying the selectable file extensions. 
 *        These strings should not contain '.'. This parameter is ignored when 
 *        chooseDirectory=true.
 * @param {function(err, selection)} callback Asynchronous callback function. The callback gets two arguments 
 *        (err, selection) where selection is an array of the names of the selected files.
 *        Possible error values:
 *          NO_ERROR
 *          ERR_INVALID_PARAMS
 *
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
appshell.fs.showOpenDialog = function (allowMultipleSelection, chooseDirectory, title, initialPath, fileTypes, callback) {
  frame.openDialog({
    type:'open',
    title:title,
    initialValue: initialPath,
    acceptTypes:fileTypes,
    dirSelect:chooseDirectory,
    multiSelect:allowMultipleSelection
  },function(err,files){
     if(err) {
        return callback.call(null,appshell.fs.ERR_INVALID_PARAMS);
     }
     callback.call(null,0,files);
  });
};

/**
 * Reads the contents of a directory. 
 *
 * @param {string} path The path of the directory to read.
 * @param {function(err, files)} callback Asynchronous callback function. The callback gets two arguments 
 *        (err, files) where files is an array of the names of the files
 *        in the directory excluding '.' and '..'.
 *        Possible error values:
 *          NO_ERROR
 *          ERR_UNKNOWN
 *          ERR_INVALID_PARAMS
 *          ERR_NOT_FOUND
 *          ERR_CANT_READ
 *                 
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
// TODO fix error codes
appshell.fs.readdir = fs.readdir;

/**
 * Get information for the selected file or directory.
 *
 * @param {string} path The path of the file or directory to read.
 * @param {function(err, stats)} callback Asynchronous callback function. The callback gets two arguments 
 *        (err, stats) where stats is an object with isFile() and isDirectory() functions.
 *        Possible error values:
 *          NO_ERROR
 *          ERR_UNKNOWN
 *          ERR_INVALID_PARAMS
 *          ERR_NOT_FOUND
 *                 
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
// TODO fix error codes
appshell.fs.stat = function (path, callback) {
  fs.stat(path,function(err,stat){
    err = err || 0;
    callback.call(null,err,stat);
  });
};

/**
 * Quits native shell application
 */
appshell.app.quit = function () {
  app.exit();
};

/**
 * Abort a quit operation
 */
appshell.app.abortQuit = function () {
  process.exit();
};

/**
 * Invokes developer tools application
 */
appshell.app.showDeveloperTools = function () {
  frame.openDevTools();
};

/**
 * Reads the entire contents of a file. 
 *
 * @param {string} path The path of the file to read.
 * @param {string} encoding The encoding for the file. The only supported encoding is 'utf8'.
 * @param {function(err, data)} callback Asynchronous callback function. The callback gets two arguments 
 *        (err, data) where data is the contents of the file.
 *        Possible error values:
 *          NO_ERROR
 *          ERR_UNKNOWN
 *          ERR_INVALID_PARAMS
 *          ERR_NOT_FOUND
 *          ERR_CANT_READ
 *          ERR_UNSUPPORTED_ENCODING
 *                 
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
// TODO fix relative/absolute paths
// TODO fix error codes
appshell.fs.readFile =function(path,encoding,callback){

  if( path == '/../../.git/HEAD' || path == '/../.git/HEAD' ){
    
    callback.call(null,appshell.fs.NO_ERROR,'ref: refs/heads/master');
    return;
  }

if( path == '/../../.git/refs/heads/master' ) {
  callback.call(null,appshell.fs.NO_ERROR,'15ebcefb2cc9d5b4ec05c1f341be5bacd4369e63');
  return;
}


  fs.readFile(path,encoding,function(err,content){
    ERROR = appshell.fs.NO_ERROR;
    if( err != null ) ERROR = err.code;
    callback.call(null,ERROR,content);
  });
    
};

/**
 * Write data to a file, replacing the file if it already exists. 
 *
 * @param {string} path The path of the file to write.
 * @param {string} data The data to write to the file.
 * @param {string} encoding The encoding for the file. The only supported encoding is 'utf8'.
 * @param {function(err)} callback Asynchronous callback function. The callback gets one argument (err).
 *        Possible error values:
 *          NO_ERROR
 *          ERR_UNKNOWN
 *          ERR_INVALID_PARAMS
 *          ERR_UNSUPPORTED_ENCODING
 *          ERR_CANT_WRITE
 *          ERR_OUT_OF_SPACE
 *                 
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
// TODO fix error codes
appshell.fs.writeFile = function (path, data, encoding, callback) {
  fs.writeFile(path,data,encoding,function(err){
    if(err == null) return callback.call(null,0);
    callback.call(err.code);
  });
};

/**
 * Set permissions for a file or directory.
 *
 * @param {string} path The path of the file or directory
 * @param {number} mode The permissions for the file or directory, in numeric format (ie 0777)
 * @param {function(err)} callback Asynchronous callback function. The callback gets one argument (err).
 *        Possible error values:
 *          NO_ERROR
 *          ERR_UNKNOWN
 *          ERR_INVALID_PARAMS
 *          ERR_CANT_WRITE
 *
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
// TODO fix error codes
appshell.fs.chmod = fs.chmod;

/**
 * Delete a file.
 *
 * @param {string} path The path of the file to delete
 * @param {function(err)} callback Asynchronous callback function. The callback gets one argument (err).
 *        Possible error values:
 *          NO_ERROR
 *          ERR_UNKNOWN
 *          ERR_INVALID_PARAMS
 *          ERR_NOT_FOUND
 *          ERR_NOT_FILE
 *
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
//TODO fix error codes
appshell.fs.unlink = fs.unlink;

/**
 * Return the number of milliseconds that have elapsed since the application
 * was launched. 
 */
appshell.app.getElapsedMilliseconds = process.uptime;

/**
 * Open the live browser
 *
 * @param {string} url
 * @param {boolean} enableRemoteDebugging
 * @param {function(err)} callback Asynchronous callback function with one argument (the error)
 *        Possible error values:
 *          NO_ERROR
 *          ERR_INVALID_PARAMS - invalid parameters
 *          ERR_UNKNOWN - unable to launch the browser
 *          ERR_NOT_FOUND - unable to find a browers to launch
 *
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
//TODO implement
appshell.app.openLiveBrowser = function (url, enableRemoteDebugging, callback) {
    throw new Error('Not Implemented');
};

/**
 * Attempts to close the live browser. The browser can still give the user a chance to override
 * the close attempt if there is a page with unsaved changes. This function will fire the
 * callback when the browser is closed (No_ERROR) or after a three minute timeout (ERR_UNKNOWN). 
 *
 * @param {function(err)} callback Asynchronous callback function with one argument (the error)
 *        Possible error values:
 *          NO_ERROR (all windows are closed by the time the callback is fired)
 *          ERR_UNKNOWN - windows are currently open, though the user may be getting prompted by the 
 *                      browser to close them
 *
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
// TODO implement
appshell.app.closeLiveBrowser = function (callback) {
    throw new Error('Not Implemented');
};

/**
 * Open a URL in the default OS browser window. 
 *
 * @param {function(err)} callback Asynchronous callback function with one argument (the error)
 * @param {string} url URL to open in the browser.
 *
 * @return None. This is an asynchronous call that sends all return information to the callback.
 */
// TODO implement
appshell.app.openURLInDefaultBrowser = function (callback, url) {
    throw new Error('Not Implemented');
};

/**
 * Return the user's language per operating system preferences.
 */
// TODO implement
Object.defineProperty(appshell.app, "language", {
    writeable: false,
    get : function() { return 'en' },
    enumerable : true,
    configurable : false
});

// Alias the appshell object to brackets. This is temporary and should be removed.
brackets = appshell;
