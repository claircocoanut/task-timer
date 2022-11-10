var tableSchedule = document.createElement("TABLE");  //makes a table element for the page
tableSchedule.setAttribute("id", "todoTable")

$(document).ready(function () {

    var isMouseDown = false;
    var lastTr = -1;

    // background colors
    var $selection = null;

    // remove selection highlight if click elsewhere
    $('*:not(#todoTable)').mousedown(function() {
        $('td').removeClass('highlight-selection');
    })    

    // highlight if select as range
    $('#todoTable').on("mousedown", ".statusCell", function(){
        isMouseDown = true;
        lastTr = $(this).closest('tr').index();
    });

    $('body').on("mouseup", function(){
        isMouseDown = false;
    });

    $("#todoTable").on("mouseover", ".statusCell", function(){
        var ctr = $(this).closest('tr').index();
        lastTr = lastTr === -1 ? ctr : lastTr;
        
        if (isMouseDown)
            if (lastTr === ctr)
                $(this).addClass("highlight-selection");
            
        // lastTr = $(this).closest('tr').index();
    });

    // highlight-selection if click
    $("#todoTable").on("click", ".statusCell", function() {
        $(this).toggleClass('highlight-selection');
    });

    // add comments if double click
    $("#todoTable").on("dblclick", ".statusCell", function() {
        if ($(this)[0].innerHTML == 1) {
            var comment=prompt('Enter comment here');
            $(this).attr("title", comment);
            if (comment.length > 0)
                $(this).addClass("with-comment");
            else
                $(this).removeClass("with-comment");
            saveTodoStatue();
        }
    });

    // convert highlight-selection -> highlight if press enter
    $('body:not(#newTodoInput)').keypress(function (e) {
        var key = e.which;
        if ($('table td.highlight-selection').length > 0) {
            $selection = $('table td.highlight-selection');
        }

        if (key == 13) {
            if ($selection !== null) {
                $selection.removeClass("highlight-selection");
                var i = $selection[0].innerHTML;
                $selection.each(function() {
                    $(this)[0].innerHTML = 1 - i;
                })
                $selection.css("opacity", 1 - i);
                saveTodoStatue();
            }
         }
    }); 
    
    // press key and add ToDo
    $('#newTodoInput, #newCategoryInput, #addTodoButton').keyup(function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            addTodo();
        }
    }); 
});


function addRowTable(newVal) {
    var newRow = tableSchedule.insertRow(tableSchedule.rows.length);
    var delButton = document.createElement("button")

    // button to delete row
    delButton.innerText = "✕";
    delButton.onclick = function(e) {
        if (confirm('Remove "' + newVal.name + '"?')) {
            $(this).closest('tr').remove();
            saveTodoStatue();
        }
    };
    newRow.insertCell(0).append(delButton)

    var taskCell = newRow.insertCell(1)
    taskCell.innerHTML = newVal.name;
    taskCell.setAttribute("title", newVal.category);
    taskCell.style.backgroundColor = taskType[newVal.category].replace(')', ', 0.1)');
    taskCell.className = "taskCell";

    for (var col = 0; col < nSection; col++) {
        var cells = newRow.insertCell(col + 2);
        cells.innerHTML = newVal.progress[col];

        if (col in newVal.comments) {
            cells.setAttribute("title", newVal.comments[col]);
            cells.style.border = "2px solid";
            cells.style.borderColor = "blue";
        }

        cells.style.opacity = newVal.progress[col];
        cells.style.backgroundColor = taskType[newVal.category];
        cells.className = "statusCell";
    }
}


function createTable() {
    
    var todo = JSON.parse(localStorage.getItem("todo-" + sessionStorage.getItem("tableDate")));

    for(var i = 0; i < todo.length; i++) {
        addRowTable(todo[i]);
    }

    var header = tableSchedule.createTHead();
    var headerRow = header.insertRow(0);
    
    headerRow.insertCell(0).style.width = '25px';

    var taskHeader = headerRow.insertCell(1);
    taskHeader.innerHTML = "Task";
    taskHeader.style.width = '200px';
    taskHeader.style.fontWeight = '900';
    taskHeader.className = "taskCell";

    for (var col = 0; col < nSection; col++) {
        if (col % nSectionPerHour == 0) {
            var cells = headerRow.insertCell(col / nSectionPerHour + 2);
            cells.style.width = '45px';
            cells.style.fontWeight = '900';
            cells.innerHTML = String(col / nSectionPerHour + startHour);
            cells.colSpan = nSectionPerHour;
            cells.className = "statusHeader";
        }
    }

    document.getElementById('schedule-table-p').append(tableSchedule);
}

function addTodo() {
    var newTodoItem = document.getElementById('newTodoInput').value;
    var newTodoCat = document.getElementById('newCategoryInput').value;
    var todo = JSON.parse(localStorage.getItem("todo-" + sessionStorage.getItem("tableDate")));

    if (newTodoItem.length > 0) 
        if (newTodoCat.length > 0)
            if (newTodoCat in taskType) {
                    var newTodoObj = {
                        "name": newTodoItem,
                        "category": newTodoCat,
                        "progress": Array(nSection).fill(0),
                        "comments": {}
                    };
                    todo.push(newTodoObj);  
                    addRowTable(newTodoObj);
                    localStorage.setItem("todo-" + sessionStorage.getItem("tableDate"), JSON.stringify(todo));
                }
            else {alert("Can't find [" + newTodoCat + "] from category.json!");}
        else {alert("Must input Category!");}
    else {alert("Must input new todo item!");}
}

// save status to localStorage
function saveTodoStatue() {

    var allTodo = []

    if (tableSchedule.rows.length > 1) {
        for (var r = 1; r < tableSchedule.rows.length; r++) {
            var thisTodo = {}
            thisTodo.name = tableSchedule.rows[r].cells[1].innerHTML;
            thisTodo.category = tableSchedule.rows[r].cells[1].getAttribute("title");
    
            var thisProgress = [];
            var thisComment = {};
            for (var c = 0; c < nSection; c++) {
                thisProgress.push(tableSchedule.rows[r].cells[c+2].innerHTML);
                var thisTitle = tableSchedule.rows[r].cells[c+2].getAttribute("title");
                if (thisTitle) {
                    console.log(thisTitle);
                    thisComment[c] = thisTitle;
                }
            }
            thisTodo.progress = thisProgress;
            thisTodo.comments = thisComment;
            allTodo.push(thisTodo);
        }
        // console.log(allTodo);
        localStorage.setItem("todo-"+sessionStorage.getItem("tableDate"), JSON.stringify(allTodo));
    }
    else 
        localStorage.setItem("todo-"+sessionStorage.getItem("tableDate"),"[]");
}

setInterval(saveTodoStatue, 600000);


// Switch to last/next date for review
function switchDate(step) {
    var toDate = Date.parse(sessionStorage.getItem("tableDate")) + step*1000*60*60*24;
    var toDateStr = new Date(toDate).toISOString().substring(0, 10);
    sessionStorage.setItem("tableDate", toDateStr);

    if (!(("todo-" + toDateStr) in localStorage)) {
        localStorage.setItem("todo-" + toDateStr, "[]");
    }
    $("#todoTable tr").remove(); 
    setDate();
    createTable();
}

// create inital table
switchDate(0);     
