// localStorage.clear();

// $.getJSON("../data/category.json", function(json) {
//     localStorage.setItem('taskType', JSON.stringify(json));
// });

// $.getJSON("../data/todo-08112022.json", function(json) {
//     localStorage.setItem('todo-2022-11-08', JSON.stringify(json));
// });

// $.getJSON("../data/todo-10112022.json", function(json) {
//     localStorage.setItem('todo-2022-11-10', JSON.stringify(json));
// });

const taskType = JSON.parse(localStorage.getItem('taskType'));

var tableType = document.createElement("TABLE");  //makes a table element for the page
tableType.setAttribute("id", "typeTable")
tableType.setAttribute("class", "typeTable")


function addRowTypeTable(categoryName, categoryColor) {
    var tableLength = tableType.rows.length
    var newRow = tableType.insertRow(tableLength);

    var numCell = newRow.insertCell(0)
    numCell.style.textAlign = "center";
    numCell.innerHTML = tableLength + 1;
    numCell.style.fontWeight = '900';

    var taskCell = newRow.insertCell(1);
    taskCell.innerHTML = categoryName;
    taskCell.style.backgroundColor = categoryColor;
    taskCell.style.paddingLeft = "4px";
}


function createTypeTable() {

    for (const [categoryName, categoryColor] of Object.entries(taskType)) {
        addRowTypeTable(categoryName, categoryColor);
    }
    
    var header = tableType.createTHead();
    var headerRow = header.insertRow(0);
    
    headerRow.insertCell(0).style.width = '25px';

    var taskHeader = headerRow.insertCell(1);
    taskHeader.innerHTML = "Category";
    taskHeader.style.fontWeight = '900';
    taskHeader.style.width = '200px';
    taskHeader.style.paddingLeft = "4px";

    document.getElementById('type-table-p').append(tableType);
}

createTypeTable();

// function addCategory() {
//     var newItem = document.getElementById('newCategoryInput').value;
//     if (newItem.length > 0) {
//         var newItemObj = {
//             "name": newTodoItem,
//             "color": Array(nSection).fill(0)
//         }
//         taskType.push(newItemObj);  
//         addRowTypeTable(newItemObj);
//     }
// }