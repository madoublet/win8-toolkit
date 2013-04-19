win8-toolkit
============

A collection of tools I use to make my Windows 8 applications awesome.

## Saving data

```js
var obj = {param1:'param1', param2:'param2'};
datastore.save('file', 'recent', obj, 5); 
```

## Getting data

```js
datastore.get('file', 'recent', function (arr) {
        for(obj in arr){
            var param = obj.param;
        }
    });
```