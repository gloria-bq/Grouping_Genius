(function(exports) {
    var getGroups = function(numOfPPLEachGroup, oriSheet) {
        var result = [];
        // console.log("start");
        var sheet = deepCopy(oriSheet);
        var numOfGroups = Math.ceil(getStudentNums(sheet) / numOfPPLEachGroup);

        for (var i = 0; i < numOfGroups; i++) {
            //it should be an array if sheet is still valid
            var aGroup = pickFromSheet(sheet, numOfPPLEachGroup);
            result.push(aGroup);
        }
        // console.log(result);
        // relocate(result);
        return {"groups": result, "numOfFeatures": getNumOfFeatures(result)};
    }
    var deepCopy = function(orisheet) {
        var sheet = [];
        for (var i = 0; i < orisheet.length; i++) {
            sheet.push(orisheet[i].slice(0));
        }
        return sheet;
    }
    var getStudentNums = function(sheet) {
        var result = 0;
        for (var i = 0; i < sheet.length; i++) {
            result += sheet[i].length;
        }
        return result;
    }
    var getStudents = function(sheet) {
        var result = [];
        for (var i = 0; i < sheet.length; i++) {
            for (var j = 0; j < sheet[i].length; j++) {
                result.push(sheet[i][j]);
            }
        }
        return result;
    }
    var pickFromSheet = function(sheet, numOfPPLEachGroup) {
        var ignoreLine = false;
        var numOfPPL = getStudentNums(sheet);
        var keepPicking = true;
        if (numOfPPL <= numOfPPLEachGroup) {
            return getStudents(sheet);
        }
        if (shouldIgnoreLine(numOfPPLEachGroup, sheet)) {
            // [TODO]should stop picking, relocating later
            ignoreLine = true;

        }
        // put index in it
        var indexResult = [];
        var lineUsed = [];
        var numOfPPLLeft = numOfPPL;
        while (keepPicking) {
            // console.log("----------------------------------------------------------------");
            // console.log("numOfPPLLeft: ", numOfPPLLeft);
            var rawIndex = Math.floor((Math.random() * numOfPPLLeft));
            // console.log("ignoreLine: ", ignoreLine);
            // // console.log("sheet length: ", sheet.length);
            // console.log("rawIndex: ", rawIndex);
            // console.log("lineUsed: ", lineUsed);
            // console.log("sheet: ", deepCopy(sheet));
            var index;
            if (!ignoreLine) {
                index = getIndexByRawIndexNotIgnoreLine(rawIndex, lineUsed, sheet);
                var line = getLineByIndex(index, sheet);
                lineUsed.push(line);
                numOfPPLLeft -= getStudentNumsByLine(line, sheet);
            } else {
                index = getIndexByRawIndexIgnoreLine(rawIndex, indexResult);
                numOfPPLLeft -= 1;
            }
            // console.log("index: ", index);
            indexResult.push(index);
            if (indexResult.length === numOfPPLEachGroup) {
                keepPicking = false;
            }
        }
        var result = convertIndexToSdtAndDelete(indexResult, sheet);
        console.log("picked std:", result.slice(0));
        return result;
    }
    var getIndexByRawIndexNotIgnoreLine = function(rawIndex, lineUsed, sheet) {
        var index = 0;
        lineUsed.sort(sortNumber);
        for (var i = 0; i < sheet.length; i++) {
            var numOfPPLThisLine = getStudentNumsByLine(i, sheet);
            if (contains(lineUsed, i)) {
                index += numOfPPLThisLine;
                continue;
            } else {
                if (rawIndex >= numOfPPLThisLine) {
                    rawIndex -= numOfPPLThisLine;
                    index += numOfPPLThisLine;
                } else {
                    //rawIndex is in this line
                    index += rawIndex;
                    return index;
                }
            }
        }
        return -999;
    }
    function sortNumber(a, b) {
        return a - b;
    }
    var getIndexByRawIndexIgnoreLine = function(rawIndex, oriIndexUsed) {
        //deep copy to sort
        var indexUsed = oriIndexUsed.slice(0);
        indexUsed.sort(sortNumber);
        for (var i = 0; i < indexUsed.length; i++) {
            if (indexUsed[i] <= rawIndex) {
                rawIndex++;
            } else {
                break;
            }
        }
        return rawIndex;
    }

    var getStudentNumsByLine = function(line, sheet) {
        return sheet[line].length;
    }
    var contains = function(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }
    var existSame = function(index, indexResult) {
        for (var i = 0; i < indexResult.length; i++) {
            if (index === indexResult[i]) {
                return true;
            }
        }
        return false;
    }
    var getLineByIndex = function(index, sheet) {
        return getLocByIndex(index, sheet).i;
    }
    var getLocByIndex = function(index, sheet) {
        for (var i = 0; i < sheet.length; i++) {
            if (index < sheet[i].length) {
                return {
                    i: i,
                    j: index
                };
            } else {
                index -= sheet[i].length;
            }
        }
        return 999;
    }
    var convertIndexToSdtAndDelete = function(indexResult, sheet) {
        var result = [];
        for (var i = 0; i < indexResult.length; i++) {
            var index = indexResult[i];
            var loc = getLocByIndex(index, sheet);
            result.push(sheet[loc.i][loc.j]);
        }
        for (var i = 0; i < indexResult.length; i++) {
            var index = indexResult[i];
            index = index - countSmallerBeforeIndex(i, indexResult);
            var loc = getLocByIndex(index, sheet);
            sheet[loc.i].splice(loc.j, 1);
        }
        cleanSheet(sheet);
        return result;
    }
    var cleanSheet = function(sheet) {
        // clean the sheet for length == 0 array
        for (var i = 0; i < sheet.length; i++) {
            if (sheet[i].length == 0) {
                sheet.splice(i, 1);
                i--;
            }
        }
        // console.log("after clean", sheet.slice(0));
    }
    var countSmallerBeforeIndex = function(end, indexResult) {
        return countSmaller(indexResult[end], end, indexResult);
    }
    var countSmaller = function(compared, end, indexResult) {
        var count = 0;
        for (var i = 0; i < end; i++) {
            if (indexResult[i] < compared) {
                count++;
            }
        }
        // console.log("count", count);
        return count;
    }

    var existSameLine = function(index, indexResult, sheet) {
        var indexLine = getLineByIndex(index, sheet);
        for (var i = 0; i < indexResult.length; i++) {
            if (indexLine === getLineByIndex(indexResult[i], sheet)) {
                return true;
            }
        }
        return false;
    }

    var shouldIgnoreLine = function(numOfPPLEachGroup, sheet) {
        //TODO: should handle no feature
        if (sheet.length < numOfPPLEachGroup) {
            return true;
        }
        return false;
    }

    var relocate = function(groups) {
        // relocate to diversify

        var numOfPPL = getStudentNums(groups);
        var numOfFeatures = getNumOfFeatures(groups);

        var count = 0;
        while (true) {
            var minRow = findMinFeaRow(numOfFeatures, groups);
            var maxRow = findMaxFeaRow(numOfFeatures, groups);

            // console.log(maxRow, minRow);
            count++;
            if (count > numOfPPL || (numOfFeatures[maxRow] - numOfFeatures[minRow]) < 2) {

                // console.log("relocate stoped", count);
                break;
            }
            // console.log("relocate invoked");
            trySwapAndUpdateNumOfFea(minRow, maxRow, numOfFeatures, groups);
        }
        // console.log("before swap lowest", numOfFeatures.slice(0));
        relocateLowest(numOfFeatures, groups);
        // console.log("after swap lowest", numOfFeatures.slice(0));        
    }
    var getNumOfFeatures = function(groups) {
        var numOfFeatures = [];
        for (var i = 0; i < groups.length; i++) {
            numOfFeatures[i] = getNumOfFeaturesInRow(groups[i]);
        }
        return numOfFeatures;
    }
    var getNumOfFeaturesInRow = function(arr) {
        var map = [];
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
            if (map[getFeature(arr[i])] == undefined) {
                map[getFeature(arr[i])] = true;
                count++;
            }
        }
        return count;
    }

    function findMinFeaRow(numOfFeatures) {
        var minIndex = 0;
        for (var i = 1; i < numOfFeatures.length; i++) {
            if (numOfFeatures[minIndex] > numOfFeatures[i]) {
                minIndex = i;
            }
        }
        return minIndex;
    }

    function findMaxFeaRow(numOfFeatures) {
        var maxIndex = 0;
        for (var i = 1; i < numOfFeatures.length; i++) {
            if (numOfFeatures[maxIndex] < numOfFeatures[i]) {
                maxIndex = i;
            }
        }
        return maxIndex;
    }
    var trySwapAndUpdateNumOfFea = function(minRow, maxRow, numOfFeatures, groups) {
        var prevailingFea = findPrevailingFea(groups[minRow]).fea;
        //find std with prevail fea
        var sdtInMinRowToSwap = findSdtWithAFea(prevailingFea, groups[minRow]);
        //find std without prevail fea
        var sdtInMaxRowToSwap = findSdtWithoutAFea(prevailingFea, groups[maxRow]);
        if (sdtInMaxRowToSwap === false || sdtInMaxRowToSwap === false) {
            console.log("fail to trySwapAndUpdateNumOfFea");
            return false;
        }
        //actually swap the ref
        // console.log(sdtInMinRowToSwap, sdtInMaxRowToSwap);
        swapSdt(minRow, sdtInMinRowToSwap, maxRow, sdtInMaxRowToSwap, groups);
        // console.log(sdtInMinRowToSwap, sdtInMaxRowToSwap);
        numOfFeatures[minRow] = getNumOfFeaturesInRow(groups[minRow]);
        numOfFeatures[maxRow] = getNumOfFeaturesInRow(groups[maxRow]);
    }

    function findPrevailingFea(arr, withoutFea) {
        var map = getFeatureMap(arr, withoutFea);
        var prevailingFea = "";
        map[prevailingFea] = -1;
        for (var key in map) {
            if (map[key] > map[prevailingFea]) {
                prevailingFea = key;
            }
        }
        return {"fea": prevailingFea, "count": map[prevailingFea]};
    }

    function getFeatureMap(arr, withoutFea) {
        var map = {};
        for (var i = 0; i < arr.length; i++) {
            var feature = getFeature(arr[i]);
            if (feature === withoutFea) {
                continue;
            }
            if (map[feature] == undefined) {
                map[feature] = 1;
            } else {
                map[feature]++;
            }
        }
        return map;        
    }

    function findSdtWithAFea(fea, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (getFeature(arr[i]) === fea) {
                return i;
            }
        }
        return false;
    }

    function findSdtWithoutAFea(fea, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (getFeature(arr[i]) !== fea) {
                return i;
            }
        }
        return false;
    }

    function swapSdt(i1, j1, i2, j2, groups) {
        var tmp = groups[i1][j1];
        groups[i1][j1] = groups[i2][j2];
        groups[i2][j2] = tmp;
    }

    function relocateLowest(numOfFeatures, groups) {
        var minNumOfFea = numOfFeatures[findMinFeaRow(numOfFeatures)];
        for (var i = 0; i < numOfFeatures.length; i++) {
            if (numOfFeatures[i] === minNumOfFea && numOfFeatures[i] < groups[i].length) {
                if (trySwapLowest(i, groups)) {
                    console.log("trySwapSuccess");
                }
                else {
                    console.log("trySwapFailed");
                }
            }
        }
    }
    function trySwapLowest(swapFromRow, groups) {
        var map = getFeatureMap(groups[swapFromRow]);
        for (var key in map) {
            if (map[key] > 1) {
                if (trySwapLowestWithSpeFea(swapFromRow, groups, key)) {
                    return true;
                }
            }
        }
        return false;
    }
    function trySwapLowestWithSpeFea(swapFromRow, groups, prevailingFeaInSwapFromRow) {
        for (var i = 0; i < groups.length; i++) {
            if (i == swapFromRow) {
                continue;
            }
            var findResult = findPrevailingFea(groups[i], prevailingFeaInSwapFromRow);
            if (findResult.count > 1) {
                var swapToCol = findSdtWithAFea(findResult.fea, groups[i]);
                var swapFromCol = findSdtWithAFea(prevailingFeaInSwapFromRow, groups[swapFromRow]);
                swapSdt(swapFromRow, swapFromCol, i, swapToCol, groups);
                return true;
            }

        }
        return false;        
    }
    exports.getGroups = getGroups;
})(this);
