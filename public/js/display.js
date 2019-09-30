(function(exports) {
    var resultTable = null;
    var usingOld = false;
    var showResult = function(groupsInTable, columnNum) {
        if (usingOld) {
            showResultOld(groupsInTable);
        } else {
            showResultNew(groupsInTable, columnNum);
        }
    }
    var showResultOld = function(groupsInTable) {
        if (resultTable == null) {
            resultTable = $('#groupingResult').dataTable({
                data: groupsInTable,
                columns: [{
                    title: "Group ID"
                }, {
                    title: "Group Members"
                }]
            });
            // $('#groupingResult').colResizable();
        } else {
            resultTable.fnClearTable();
            resultTable.fnAddData(groupsInTable);
        }
    };
    //Not using dataTables
    function showResultNew(groupsInTable, numOfPPLEachGroup) {
        var tbl = document.getElementById('groupingResult');
        tbl.innerHTML = "";
        var thr = tbl.insertRow();
        for (var i = 0; i < numOfPPLEachGroup + 2; i++) {
            var th = document.createElement('th');
            if (i === 0) {
                th.innerHTML = "Group ID";
            } else if (i === numOfPPLEachGroup + 1) {
                th.innerHTML = "Number Of Features";
            } else {
                th.innerHTML = "Group Member " + String(i);
            }
            thr.appendChild(th);
        }
        for (var i = 0; i < groupsInTable.length; i++) {
            var tr = tbl.insertRow();
            for (var j = 0; j < numOfPPLEachGroup + 2; j++) {
                // if (j >= groupsInTable[i].length) {
                //     tr.insertCell().innerHTML = "";
                // } else {
                    tr.insertCell().innerHTML = groupsInTable[i][j];
                // }
            }
        }
    }
    exports.showResult = showResult;
})(this);
