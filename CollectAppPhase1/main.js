var ajaxreq=false, ajaxCallback;

window.onload = function(){
    startFunction();
};

// ajaxRequest: Sets up a request
function ajaxRequest(filename) {
   try {
      //make a new request object
      ajaxreq= new XMLHttpRequest();
   } catch (error) {
      return false;
   }
   ajaxreq.open("GET", filename);
   ajaxreq.setRequestHeader("X-Api-Key", "e993dbe5-a4b1-4b88-9ff7-2e6003b9fc75");
   ajaxreq.onreadystatechange = ajaxResponse;

    ajaxreq.send(null);
}

// ajaxResponse: Waits for response and calls a function
function ajaxResponse() {
    if(ajaxreq.readyState != 4){
        return;
    }
   if(ajaxreq.status == 200) {
       var data = JSON.parse(ajaxreq.responseText);
       if(ajaxCallback) ajaxCallback(data);
   }
   else{
       alert(ajaxreq.statusText);
   }
   return true;
}

function startFunction(){
    ajaxCallback = showJSON;
    ajaxRequest("https://api.pokemontcg.io/v2/cards?page=1&pageSize=1");
}

function showJSON(data){
    var rawTemplate = document.getElementById("cardTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);

    var ourGeneratedHTML = compiledTemplate(data.data[0]);

    document.getElementById("cardPlace").innerHTML = ourGeneratedHTML;
}