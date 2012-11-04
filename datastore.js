/*
    Datastore is a simple JS library to save JS objects in Windows 8 applications.  Supports localStorage (HTML5), localSettings (WinJS), and file (WinJS).

    Created:  Matthew Smith, 11/4/2012
    License:  Do whatever you want with it

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
        datastore.getIndex('file', 'recent', function (arr) {
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