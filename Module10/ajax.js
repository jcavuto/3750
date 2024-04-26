// global variables to keep track of the request
// and the function to call when done
var ajaxreq=false;

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
   ajaxreq.send(null);
}

// ajaxResponse: Waits for response and calls a function
function ajaxResponse() {
   if (ajaxreq.readyState !=4) return;
   if (ajaxreq.status==200) {
      // if the request succeeded...
      statesAndCapitols=JSON.parse(ajaxreq.responseText);
   } 
   else alert("Request failed: " + ajaxreq.statusText);

   return true;
}

var statesAndCapitols;
var resultsOfSearch = {};

window.onload=function(){
   ajaxRequest('search.php');
};

function inputFunction(event){
   var input = event.target.value;

   searchForState(input);
   displayResults();
}

function searchForState(input){
   resultsOfSearch = {};
   for(var state in statesAndCapitols){
      if(state.toLowerCase().startsWith(input.toLowerCase())){
         resultsOfSearch[state] = statesAndCapitols[state];
      }
   }
}

function displayResults(){
   var displayArea = document.getElementById('list');

   displayArea.innerHTML = "";

   console.log(Object.keys(resultsOfSearch).length == 0);

   if(Object.keys(resultsOfSearch).length == 0){
    var newListItem = document.createElement('li');
    newListItem.innerHTML = "No Results Found";
    displayArea.append(newListItem);
   }
   else{
      for(var state in resultsOfSearch){
         var newListItem = document.createElement('li');
         newListItem.innerHTML = "" + resultsOfSearch[state] + ", " + state;
         displayArea.append(newListItem);
      }
   }

};

