var dateSpan = document.getElementById('current-date');
var dateSpanLabel = document.getElementById('current-date-label');
var timeSpan = document.getElementById('current-time');


function setTime() {
    var d = new Date();
    timeSpan.textContent = d.toLocaleTimeString();
}

function getLocalDateToday() {
    var d = new Date();
    var dStr = d.toLocaleDateString();
    return dStr.substring(6) + "-" + dStr.substring(3, 5) + "-" + dStr.substring(0, 2);

}

setTime();
dateSpan.textContent = getLocalDateToday()


function setDateLabel() {
    dateSpanLabel.textContent =  "(T" + 
        (Math.floor((Date.parse(dateSpan.textContent) - Date.parse(getLocalDateToday())) / (1000*60*60*24))) + ")";
}

setInterval(setTime, 1000);
// setInterval(setDateLabel, 1000);

function setCurrentTimeMargin() {
    var t = new Date("2000-01-01T" + timeSpan.textContent) - 
            new Date(2000, 0, 1, startHour, 0, 0)
    tSection = Math.ceil(t / 1000 / 60 / 60 * nSectionPerHour)

    $("*:not(table tr td:nth-child(" + String(tSection + 2) + "))")
        .removeClass('current-time-selection');

    $("table tr td:nth-child(" + String(tSection + 2) + ")")
        .addClass('current-time-selection');

    $(".statusHeader").removeClass('current-time-selection');

}

setInterval(setCurrentTimeMargin, 1000);