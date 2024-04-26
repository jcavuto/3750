document.addEventListener("DOMContentLoaded", function(){
    getCars();
});

function getCars(){
    var ajaxreq = new XMLHttpRequest();

    ajaxreq.onreadystatechange = function(){
        if (ajaxreq.readyState !=4) return;
        if (ajaxreq.status==200) {
            var data = ajaxreq.responseText;
            display(data);
        } 

        else alert("Request failed: " + ajaxreq.statusText);
        return true;
    };

    ajaxreq.open("GET", "php/cars.php?function=getCars");
    ajaxreq.send(null);
}

function display(data){
    document.getElementById('carDisplay').innerHTML = data;
}

function clearCars(){
    var clearRequest = new XMLHttpRequest();

    clearRequest.onreadystatechange = function(){
        if (clearRequest.readyState !=4) return;
        if (clearRequest.status==200) {
            var data = clearRequest.responseText;
            display(data);
        } 

        else alert("Request failed: " + clearRequest.statusText);
        return true;
    };

    clearRequest.open("GET", "php/cars.php?function=clearCars");
    clearRequest.send(null);
}