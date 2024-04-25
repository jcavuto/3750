//START PREWRITTEN AJAX STUFF
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
   ajaxreq.setRequestHeader("X-Api-Key", "e993dbe5-a4b1-4b88-9ff7-2e6003b9fc75");
   ajaxreq.onreadystatechange = ajaxResponse;

    ajaxreq.send(null);
}

// ajaxResponse: Waits for response and calls a function
function ajaxResponse() {
    if(ajaxreq.readyState != 4){
        console.log(ajaxreq.readyState);
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
//END PREWRITTEN AJAX STUFF

var submitButton = document.getElementById('submitNumber');
var numPerPage = 10;
var page = 1;
var totalPages = 1000000;

var nextPageButton = document.getElementById('nextPage');
var lastPageButton = document.getElementById('lastPage');

nextPageButton.onclick = function(){
    if(page<totalPages) page++;
    if(page > 1)    lastPageButton.className = "";
    if(page == totalPages)  nextPageButton.className = "myhide";
    startFunction();
};

lastPageButton.onclick = function(){
    if(page > 1)    page--;
    if(page < totalPages)   nextPageButton.className = "";
    if(page == 1)   lastPageButton.className = "myhide";
    startFunction();
};

submitButton.onclick = function(){
    numPerPage = document.getElementById('dropdownInput').value;
    page = 1;
    startFunction();
};

var filterquery = "orderBy=name";
var filterInput = document.getElementById('filterinput');

filterInput.onchange = function(){
    filterquery = filterInput.value;
    page = 1;
    startFunction();
};

function startFunction(){
    ajaxCallback = showJSON;
    ajaxRequest("https://api.pokemontcg.io/v2/cards?" + filterquery + "&page=" + page + "&pageSize=" + numPerPage);
}

function showJSON(data){
    var rawTemplate = document.getElementById("cardTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);


    var container = document.getElementById('cardAreaBrowse');
    container.innerHTML = "";
    for(i = 0; i < data.data.length; i++){
        container.innerHTML += compiledTemplate(data.data[i]);
    }

    var numresults = document.getElementById('numresults');
    var pages = document.getElementById('pages');

    pages.innerHTML = "";
    numresults.innerHTML = "";
    var totalCount = "" + data.totalCount;
    var startingPage = (page - 1) * parseInt(numPerPage) + 1;
    var endingPage = (page - 1) * parseInt(numPerPage) + parseInt(numPerPage);
    if(endingPage > data.totalCount) endingPage = data.totalCount;
    var onpage = "" + startingPage + "-" + endingPage;
    totalPages = Math.ceil(data.totalCount / numPerPage);

    numresults.innerHTML += "Viewing Cards: " + onpage + " / " + totalCount;
    pages.innerHTML += "&nbspPage: " + page + " / " + totalPages;
    console.log(data.data[0].tcgplayer.prices.holofoil.market);
}

window.onload = function(){
    startFunction();
};

Handlebars.registerHelper('decimalFunction', function(number) {
    return parseFloat(number).toFixed(2);
});

//When A show more button is clicked, send request for card info
function showMoreInfo(event){
    document.getElementById('cardAreaBrowse').className = "myhide";
    document.getElementById('filterAreaBrowse').className = "myhide";
    document.getElementById('cardInfoArea').className = "";

    ajaxCallback = showCardInfo;
    ajaxRequest("https://api.pokemontcg.io/v2/cards?q=id:" + event.target.id + "&pageSize=1&page=1");
}

//show the card info
function showCardInfo(data){
    var rawTemplate = document.getElementById("infoTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);

    var generatedHTML = compiledTemplate(data.data[0]);
    document.getElementById('cardInfoArea').innerHTML = generatedHTML;
}

//When the go back button is pushed
function goBackSearch(){
    document.getElementById('cardAreaBrowse').className = "";
    document.getElementById('filterAreaBrowse').className = "";
    document.getElementById('cardInfoArea').innerHTML = "";
    document.getElementById('cardInfoArea').className = "myhide";
}

