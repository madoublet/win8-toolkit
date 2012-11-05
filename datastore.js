/*
    Datastore is a simple JS library to save JS objects in Windows 8 applications.  Supports localStorage (HTML5), localSettings (WinJS), and file (WinJS).

    Created:  Matthew Smith, 11/4/2012
    
    This is free and unencumbered software released into the public domain.

    Anyone is free to copy, modify, publish, use, compile, sell, or
    distribute this software, either in source code form or as a compiled
    binary, for any purpose, commercial or non-commercial, and by any
    means.

    In jurisdictions that recognize copyright laws, the author or authors
    of this software dedicate any and all copyright interest in the
    software to the public domain. We make this dedication for the benefit
    of the public at large and to the detriment of our heirs and
    successors. We intend this dedication to be an overt act of
    relinquishment in perpetuity of all present and future rights to this
    software under copyright law.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
    OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
    
    For more information, please refer to <http://unlicense.org/>

    Parameters:
    type = 'file'                   // how you want to store the file  (localStorage, localSettings, file)
    store = 'store-name';           // name of the datastore
    obj = {param1: 'param1'};       // JS object to store
    max = 5;                        // max # of objects in the queue
*/
var applicationData = Windows.Storage.ApplicationData.current;
var localSettings = applicationData.localSettings;
var localFolder = applicationData.localFolder;

var datastore = {

    d_max: 20, // default maximum

    /*  
        var obj = {param1:'param1', param2:'param2'};
        datastore.save('file', 'recent', obj, 5); 
    */
    save: function (type, store, obj, max) {

        var objs = [];
        if (!max) max = d_max;

        function saveToStore(objs) {
   
            // push new object
            objs.push(obj);

            // fix queue size
            while (objs.length > max) {
                objs.shift();
            }

            if (type == 'localStorage') {
                localStorage[store] = JSON.stringify(objs);
            }
            else if (type == 'localSettings') {
                localSettings.values[store] = JSON.stringify(objs);
            }
            else if (type == 'file') {
                var fileName = store + '.txt';
                var fileContents = JSON.stringify(objs);

                localFolder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.replaceExisting)
                    .then(function (file) {

                        return Windows.Storage.FileIO.writeTextAsync(file, fileContents);
                    }).done(function () {
                    });
            }
        }

        if (type == 'localStorage') {
            if (localStorage[store]) saveToStore(JSON.parse(localStorage[store]));
            else saveToStore([]);
        }
        else if (type == 'localSettings') {
            if (localSettings.values[store]) saveToStore(JSON.parse(localSettings.values[store]));
            else saveToStore([]);
        }
        else if (type == 'file') {
            var fileName = store + '.txt';

            localFolder.getFileAsync(fileName)
                .then(function (file) {
                    return Windows.Storage.FileIO.readTextAsync(file);
                }).done(function (data) { // data is contained in data
                    saveToStore(JSON.parse(data));
                }, function () {
                    saveToStore([]);
                });
        }

        
        return;
    },

    /*  
        datastore.get('file', 'recent', function (arr) {
                for(obj in arr){
                    var param = obj.param;
                }
            });
    */
    get: function (type, store, callback) {

        if (type == 'localStorage') {
            if (localStorage[store]) callback(JSON.parse(localStorage[store]));  // get & parse json
            else return {};
        }
        else if (type == 'localSettings') {
            if (localSettings.values[store]) callback(JSON.parse(localSettings.values[store]));  // get & parse json
            else return {};
        }
        else if (type == 'file') {
            var fileName = store + '.txt';

            localFolder.getFileAsync(fileName)
                .then(function (file) {
                    return Windows.Storage.FileIO.readTextAsync(file);
                }).done(function (data) { // data is contained in data
                    callback(JSON.parse(data));
                }, function () {
                     callback([]);
                });
        }

        return;
    },

    /*  
        datastore.getIndex('file', 'recent', index, function (obj) {
                var param = obj.param;
            });
    */
    getIndex: function (type, store, index, callback) {

        if (type == 'localStorage') {
            if (localStorage[store]) callback(JSON.parse(localStorage[store])[index]);  // get & parse json
            else return {};
        }
        else if (type == 'localSettings') {
            if (localSettings.values[store]) callback(JSON.parse(localSettings.values[store])[index]);  // get & parse json
            else return {};
        }
        else if (type == 'file') {
            var fileName = store + '.txt';

            localFolder.getFileAsync(fileName)
                .then(function (file) {
                    return Windows.Storage.FileIO.readTextAsync(file);
                }).done(function (data) { // data is contained in data
                    callback(JSON.parse(data)[index]);
                }, function () {
                    callback([]);
                });
        }

        // return empty bject
        return;
    }

};