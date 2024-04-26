
function submitForm(event){
    event.preventDefault();
    
    var form = document.getElementById("form");
    var data = new FormData(form);
    var ajaxreq = new XMLHttpRequest();

    ajaxreq.onreadystatechange = function(){
        if (ajaxreq.readyState !=4) return;
        if (ajaxreq.status==200) {
            var responseText = ajaxreq.responseText;
            document.getElementById('responseArea').innerHTML = responseText;
            document.getElementById('responseArea').innerHTML += "<br><a href=\'display.html\'>Go To Your Cars</a>"
        } 

        else alert("Request failed: " + ajaxreq.statusText);
        return true;
    };

    ajaxreq.open("POST", "php/cars.php");
    console.log(data);
    ajaxreq.send(data);
}