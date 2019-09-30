// xlsx.js (C) 2013-2015 SheetJS http://sheetjs.com
// Modified by Bingqing Sun
(function(exports) {
    var X = XLSX;


    function fixdata(data) {
        var o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }
    var jsonSheet = {};

    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result = roa;
            }
        });
        return result;
    }

    function getJsonSheet() {
        return jsonSheet;
    }

    function process_wb(wb) {
        jsonSheet = to_json(wb);
        updateFeatures();
    }

    function updateFeatures() {
        var options = document.getElementById('feature').options;
        options.length = 0;
        for (var key in jsonSheet[0]) {
            // console.log(key);
            var option = document.createElement("option");
            option.text = key;
            options.add(option);
        }
        options[0].text = "No Feature";
    }

    var drop = document.getElementById('drop');

    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        var f = files[0]; {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function(e) {
                if (typeof console !== 'undefined') console.log("onload", new Date());
                var data = e.target.result;
                var arr = fixdata(data);
                wb = X.read(btoa(arr), {
                    type: 'base64'
                });
                process_wb(wb);

            };
            reader.readAsArrayBuffer(f);
        }
    }

    function handleDragover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    if (drop.addEventListener) {
        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
    }


    var xlf = document.getElementById('xlf');

    function handleFile(e) {
        var files = e.target.files;
        var f = files[0]; {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function(e) {
                if (typeof console !== 'undefined') console.log("onload", new Date());
                var data = e.target.result;
                var wb;
                var arr = fixdata(data);
                wb = X.read(btoa(arr), {
                    type: 'base64'
                });

                process_wb(wb);

            };
            reader.readAsArrayBuffer(f);
        }
    }

    if (xlf.addEventListener) xlf.addEventListener('change', handleFile, false);
    exports.getJsonSheet = getJsonSheet;
})(this);
