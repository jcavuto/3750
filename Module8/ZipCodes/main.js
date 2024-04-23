var ajaxreq=false, ajaxCallback;

// ajaxRequest: Sets up a request
function ajaxRequest(filename) {
   try {
      //make a new request object
      ajaxreq= new XMLHttpRequest();
   } catch (error) {
      return false;
   }
   ajaxreq.open("GET", filename);
   ajaxreq.onreadystatechange = ajaxResponse;

   if(zip1Value == ""){
       errorBox.className = "";
       if(zip2Value == ""){
           errorBox.innerHTML = "<p>You need to enter a zip code into both.</p>";
           return;
       }
       errorBox.innerHTML = "<p>You need to enter a zip code into zip code 1.</p>";
   }
   else if(zip2Value == ""){
       errorBox.className = "";
       errorBox.innerHTML = "<p>You need to enter a zip code into zip code 2</p>";
   }
   else{
    ajaxreq.send(null);
   }
}

// ajaxResponse: Waits for response and calls a function
function ajaxResponse() {
   if (ajaxreq.readyState !=4) {
       return;
   }
   if(ajaxreq.status == 600){
       errorBox.className = "";
       errorBox.innerHTML = "<p>" + ajaxreq.statusText + "</p>";
   }
   else if(ajaxreq.status == 200) {
       if(ajaxCallback) ajaxCallback();
   }
   else{
       alert(ajaxreq.statusText);
   }
   return true;
}

var startButton = document.getElementById('zip-submit-btn');
var zip1Input = document.getElementById('zip1');
var zip2Input = document.getElementById('zip2');
var zip1Value;
var zip2Value;
var errorBox = document.getElementById('error');


startButton.addEventListener("click", function(){
    ajaxCallback = displayTest;
    zip1Value = zip1Input.value;
    zip2Value = zip2Input.value;
    document.getElementById('distance').className="myhide";
    errorBox.className = "myhide";
    ajaxRequest("https://jeremycavuto.com/Module8/ZipCodes/zipcodes.php?zip1=" + zip1Value + "&zip2=" + zip2Value);
});


function displayTest(){
    document.getElementById('distance').className = "";
    var rawTemplate = document.getElementById('output-template').innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);
    var ourData = JSON.parse(ajaxreq.responseText);
    var ourGeneratedHTML = compiledTemplate(ourData);
    document.getElementById('distance').innerHTML = ourGeneratedHTML;

}