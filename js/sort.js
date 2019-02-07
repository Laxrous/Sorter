var finishFlag = 0;

function loadList() {
    var load = document.getElementById("sortFile");
    var sortFile = document.getElementById("sortFilename")
    if (load.value) {
        sortFile.innerHTML = load.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
        var f = load.files[0];
        var c = [];
        var r = new FileReader();
        r.onload = function(e) {
            var lines = this.result.split('\n');
            for (var i = 0; i < lines.length; i++) {
                c[i] = lines[i];
            }
            Sort.origList = c.slice(0);
            document.getElementById("messageWrap").style.display ="none";
            document.getElementById("importSaveButton").style.display ="none";
            document.getElementById("sortWrap").style.display = "block";
            initList();
            showImage();
        };
        r.readAsText(f);
    }
};

function importFile() {
    var imp = document.getElementById("importSave");
    var impFile = document.getElementById("importFilename");
    if (imp.value) {
        impFile.innerHTML = imp.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
        var f = imp.files[0];
        var r = new FileReader();
        r.onload = function(e) {
            var data = JSON.parse(this.result);
            Sort.origList = data.origList;
            Sort.list = data.list;
            Sort.parent = data.parent;
            Sort.equal = data.equal;
            Sort.copy = data.copy;
            Sort.copyIndex = data.copyIndex;
            Sort.cmp1 =data.cmp1;
            Sort.cmp2 = data.cmp2;
            Sort.head1 = data.head1;
            Sort.head2 = data.head2;
            Sort.numQ = data.numQ;
            Sort.totalSize = data.totalSize;
            Sort.finishSize = data.finishSize;
            document.getElementById("messageWrap").style.display ="none";
            document.getElementById("sortFileButton").style.display ="none";
            document.getElementById("sortWrap").style.display = "block";
            showImage();
        };
        r.readAsText(f);
    }
};

function initList() {
    var n = 0;
    var mid;
    var i;
    
    for (i = 0; i < Sort.origList.length; i++) {
        Sort.list[0][i] = i;
    }
    Sort.parent[n] = -1;
    Sort.totalSize = 0;
    n++;
    for (i = 0; i < Sort.list.length; i++) {
        if (Sort.list[i].length >= 2) {
            mid = Math.ceil(Sort.list[i].length / 2);
            Sort.list[n] = new Array();
            Sort.list[n] = Sort.list[i].slice(0, mid);
            Sort.totalSize += Sort.list[n].length;
            Sort.parent[n] = i;
            n++;
            Sort.list[n] = new Array();
            Sort.list[n] = Sort.list[i].slice(mid, Sort.list[i].length);
            Sort.totalSize += Sort.list[n].length;
            Sort.parent[n] = i;
            n++;
        }
    }

    for (i = 0; i < Sort.origList.length; i++) {
        Sort.copy[i] = 0;
    }
    Sort.copyIndex = 0;
    for (i = 0; i <= Sort.origList.length; i++) {
        Sort.equal[i] = -1;
    }
    Sort.cmp1 = Sort.list.length - 2;
    Sort.cmp2 = Sort.list.length - 1;
    Sort.head1 = 0;
    Sort.head2 = 0;
    Sort.numQ = 1;
    Sort.finishSize = 0;
    finishFlag = 0;
}

function showImage() {
    var str0 = "<h4 class=\"battle\">Battle #" + Sort.numQ + "</h4>" + Math.floor(Sort.finishSize * 100 / Sort.totalSize) + "% sorted<br>" + Sort.origList.length + " items";
    var str1 = "" + Sort.origList[Sort.list[Sort.cmp1][Sort.head1]];
    var str2 = "" + Sort.origList[Sort.list[Sort.cmp2][Sort.head2]];
    document.getElementById("battleNumber").innerHTML = str0;
    document.getElementById("leftField").innerHTML = str1;
    document.getElementById("rightField").innerHTML = str2;
    Sort.numQ++;
}

function sortList(flag) {
    var i;
    var str;

    if (flag < 0) {
        Sort.copy[Sort.copyIndex] = Sort.list[Sort.cmp1][Sort.head1];
        Sort.head1++;
        Sort.copyIndex++;
        Sort.finishSize++;
        while (Sort.equal[Sort.copy[Sort.copyIndex - 1]] != -1) {
            Sort.copy[Sort.copyIndex] = Sort.list[Sort.cmp1][Sort.head1];
            Sort.head1++;
            Sort.copyIndex++;
            Sort.finishSize++;
        }
    } else if (flag > 0) {
        Sort.copy[Sort.copyIndex] = Sort.list[Sort.cmp2][Sort.head2];
        Sort.head2++;
        Sort.copyIndex++;
        Sort.finishSize++;
        while (Sort.equal[Sort.copy[Sort.copyIndex - 1]] != -1) {
            Sort.copy[Sort.copyIndex] = Sort.list[Sort.cmp2][Sort.head2];
            Sort.head2++;
            Sort.copyIndex++;
            Sort.finishSize++;
        }
    }

    if (Sort.head1 < Sort.list[Sort.cmp1].length && Sort.head2 == Sort.list[Sort.cmp2].length) {
        while (Sort.head1 < Sort.list[Sort.cmp1].length) {
            Sort.copy[Sort.copyIndex] = Sort.list[Sort.cmp1][Sort.head1];
            Sort.head1++;
            Sort.copyIndex++;
            Sort.finishSize++;
        }
    } else if (Sort.head1 == Sort.list[Sort.cmp1].length && Sort.head2 < Sort.list[Sort.cmp2].length) {
        while (Sort.head2 < Sort.list[Sort.cmp2].length) {
            Sort.copy[Sort.copyIndex] = Sort.list[Sort.cmp2][Sort.head2];
            Sort.head2++;
            Sort.copyIndex++;
            Sort.finishSize++;
        }
    }
    
    if (Sort.head1 == Sort.list[Sort.cmp1].length && Sort.head2 == Sort.list[Sort.cmp2].length) {
        for (i = 0; i < Sort.list[Sort.cmp1].length + Sort.list[Sort.cmp2].length; i++) {
            Sort.list[Sort.parent[Sort.cmp1]][i] = Sort.copy[i];
        }
        Sort.list.pop();
        Sort.list.pop();
        Sort.cmp1 = Sort.cmp1 - 2;
        Sort.cmp2 = Sort.cmp2 - 2;
        Sort.head1 = 0;
        Sort.head2 = 0;

        if (Sort.head1 == 0 && Sort.head2 == 0) {
            for (i = 0; i < Sort.origList.length; i++) {
                Sort.copy[i] = 0;
            }
            Sort.copyIndex = 0;
        }
    }
    var sortSave = {
        origList: Sort.origList,
        list: Sort.list,
        parent: Sort.parent,
        equal: Sort.equal,
        copy: Sort.copy,
        copyIndex: Sort.copyIndex,
        cmp1:Sort.cmp1,
        cmp2: Sort.cmp2,
        head1: Sort.head1,
        head2: Sort.head2,
        numQ: Sort.numQ,
        totalSize: Sort.totalSize,
        finishSize: Sort.finishSize
    };
    localStorage.setItem('sortSave', JSON.stringify(sortSave));
    document.getElementById("saveButton").style.display ="inline-block";
    document.getElementById("save").style.display ="Save Session to File";

    if (Sort.cmp1 < 0) {
        str = "battle #" + (Sort.numQ - 1) + "<br>" + Math.floor(Sort.finishSize * 100 / Sort.totalSize) + "% sorted.";
        document.getElementById("battleNumber").innerHTML = str;
        showResult();
        finishFlag = 1;
    } else {
        showImage();
    }
}

function showResult() {
    var ranking = 1;
    var str = "";
    str += "<table id=\"resultTable\" align=\"center\">";
    str += "<thead><tr><th>Rank<\/th><th>Song<\/th><\/tr><\/thead><tbody>";
    for (var i = 0; i < Sort.origList.length; i++) {
        str += "<tr><td>" + ranking + "<\/td><td>" + Sort.origList[Sort.list[0][i]] + "<\/td><\/tr>";
        if (i < Sort.origList.length - 1) {
            ranking++;
        }
    }
    str += "</tbody";
    document.getElementById("resultField").innerHTML = str;
    document.getElementById("save").innerHTML = "Save Results to File";
    document.getElementById("sortWrap").style.display ="none";
    document.getElementById("messageWrap").style.display ="block";
}
function save() {
    var arr = [];
    var str = '';
    var table = document.getElementById("resultTable");
    var btn = document.getElementById("save");
    var filename;
    var file;
    var end;
    if (Sort.cmp1 == -1) {
        for (var i = 1; i < table.rows.length; i++) {
            arr.push(i + ". " + table.rows[i].cells[1].innerText);
        }
        str = arr.join("\r\n");
        end = "SortedResults.txt";
    }
    else {
        var sortSave = {
            origList: Sort.origList,
            list: Sort.list,
            parent: Sort.parent,
            equal: Sort.equal,
            copy: Sort.copy,
            copyIndex: Sort.copyIndex,
            cmp1:Sort.cmp1,
            cmp2: Sort.cmp2,
            head1: Sort.head1,
            head2: Sort.head2,
            numQ: Sort.numQ,
            totalSize: Sort.totalSize,
            finishSize: Sort.finishSize
        };
        str = JSON.stringify(sortSave);
        end = "SortSession.txt";
    }
    file = new Blob([str], {type: "text/plain"});
    btn.href = URL.createObjectURL(file);
    btn.download = end;
}
function reset() {
    localStorage.clear();
    finishFlag = 0;
    document.getElementById("sortFile").value = '';
    document.getElementById("sortFileButton").style.display ="inline-block";
    document.getElementById("importSaveButton").style.display ="inline-block";
    document.getElementById("sortFile").value = "";
    document.getElementById("importSave").value = "";
    document.getElementById("messageWrap").style.display ="block";
    document.getElementById("sortContainer").style.display = "block";
    document.getElementById("sortWrap").style.display ="none";
    //document.getElementById("resultField").outerHTML ="<div id=\"resultField\"></div>";
    document.getElementById("sortFilename").innerHTML = "Select a List to Sort";
    document.getElementById("importFilename").innerHTML = "Import File";
    document.getElementById("saveButton").style.display ="none";
};