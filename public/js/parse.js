(function(exports) {
    var hasFeature = true;
    var featureIndex = 1;
    var parseGroupsToTable = function(groups, numOfFeatures) {
        var table = [];
        for (var i = 0; i < groups.length; i++) {
            var line = [];
            line.push(i + 1);

            for (var j = 0; j < groups[0].length; j++) {
                var groupMember = "";
                if (j < groups[i].length) {
                    groupMember = groupMember + "<span class = 'nameAndFeature'><span class='name'>" + getName(groups[i][j]) + "</span>&nbsp;<span class='feature'>(" + getFeature(groups[i][j]) + ")</span></span>";
                }
                line.push(groupMember);
            }
            line.push(numOfFeatures[i]);
            table.push(line);
        }
        return table;
    }
    var groupSheetByFeature = function(jsonSheet, fIndex) {
        featureIndex = fIndex;
        var sheet = [];
        var map = {};
        var sheetRow = -1;
        for (var i = 0; i < jsonSheet.length; i++) {
            var feature = getFeature(jsonSheet[i]);
            if (map[feature] === undefined) {
                sheetRow++;
                map[feature] = sheetRow;
                var row = [];
                row.push(jsonSheet[i]);
                sheet.push(row);
            } else {
                sheet[map[feature]].push(jsonSheet[i]);
            }
        }
        return sheet;
    }
    var getName = function(jsonObj) {
        return jsonObj[getKey(jsonObj, 0)];
    }
    var getFeature = function(jsonObj) {
        if (featureIndex === 0) {
            return "";
        }
        return jsonObj[getKey(jsonObj, featureIndex)];
    }
    var getKey = function(jsonObj, whichKey) {
        var i = 0;
        for (var key in jsonObj) {
            if (i === whichKey) {
                return key;
            }
            i++;
        }
    }
    exports.groupSheetByFeature = groupSheetByFeature;
    exports.parseGroupsToTable = parseGroupsToTable;
    exports.getName = getName;
    exports.getFeature = getFeature;
})(this);
