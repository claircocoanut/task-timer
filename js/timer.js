var dateSpan = document.getElementById('current-date');
var dateSpanLabel = document.getElementById('current-date-label');
var timeSpan = document.getElementById('current-time');

setTime();
setDate();

function setTime() {
    var d = new Date();
    timeSpan.textContent = d.toLocaleTimeString();
}

function setDate() {
    if (!("tableDate" in sessionStorage)) {
        var d = new Date();
        sessionStorage.setItem("tableDate", d.toISOString().substring(0, 10))
        dateSpan.textContent = sessionStorage.getItem("tableDate");
        dateSpanLabel.textContent = " (T0)"
    }
    else {
        dateSpan.textContent = sessionStorage.getItem("tableDate");
        dateSpanLabel.textContent = " (T" + 
            Math.floor((Date.parse(dateSpan.textContent) - new Date()) / (1000*60*60*24)) + ")";
    }
}

setInterval(setTime, 1000);
setInterval(setDate, 1000);

function setCurrentTimeMargin() {
    var t = new Date("2000-01-01T" + timeSpan.textContent) - 
            new Date(2000, 0, 1, startHour, 0, 0)
    tSection = Math.ceil(t / 1000 / 60 / 60 * nSectionPerHour)

    $("*:not(table tr td:nth-child(" + String(tSection + 2) + "))")
        .removeClass('current-time-selection');

    $("table tr td:nth-child(" + String(tSection + 2) + ")")
        .addClass('current-time-selection');
}

setCurrentTimeMargin();
setInterval(setCurrentTimeMargin, 1000);