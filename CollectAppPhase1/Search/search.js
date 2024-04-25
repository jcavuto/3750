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


//Start Button
var startButton = document.getElementById('startSearch');

//Start Button Click
startButton.onclick = function(){
    page = 1;
    startSearch();
};

//Last Page Button
var lastPageButton = document.getElementById('lastPage');

//Next Page Button
var nextPageButton = document.getElementById('nextPage');

//Last Page Button click function
lastPageButton.onclick = function(){
    pageNum--;
    
    if(pageNum == 1)    lastPageButton.className = "myhide";
    if(pageNum < totalPages)    nextPageButton.className = "";
    startSearch();
};

//Next Page Button click function
nextPageButton.onclick = function(){
    pageNum++;

    if(pageNum == totalPages)   nextPageButton.className = "myhide";
    if(pageNum > 1) lastPageButton.className = "";
    startSearch();
};

//Name Search Input
var searchInput = document.getElementById('searchInput');

//SuperType Input
var supertypeSelect = document.getElementById('supertype-select');

//Regular Type Select
var typeSelect = document.getElementById('type-select');

//Subtype Select
var subtypeSelect = document.getElementById('subtype-select');

//Rarity Select
var raritySelect = document.getElementById('rarity-select');

//NumPerPage Input
var numPerPageInput = document.getElementById('cards-per-page');

//Start at the first page
var pageNum = 1;

//Function to update the page when a new amount of cards per page is selected
numPerPageInput.onchange = function(){
    page = 1;
    startSearch();
};

//Min and Max HP filters (only on Supertype Pokémon)
var minHPFilter = document.getElementById('minHP');
var maxHPFilter = document.getElementById('maxHP');

//Total Page Count
var totalPages;

//Total Elements Count
var totalElements;

//If supertype is not pokemon, no hp filters
supertypeSelect.onchange = function(){
    if(supertypeSelect.value == " supertype:Pokémon"){
        minHPFilter.className = "";
        maxHPFilter.className = "";
    }
    else{
        minHPFilter.className = "myhide";
        maxHPFilter.className = "myhide";
    }
};

//When window loads get subtype options
window.onload = function(){
    getSubTypeOptions();
};

//make ajax request for subtype options
function getSubTypeOptions(){
    ajaxCallback = generateSubTypeOptions;
    ajaxRequest("https://api.pokemontcg.io/v2/subtypes");
}

//make ajax request for supertype options
function getSuperTypeOptions(){
    ajaxCallback = generateSuperTypeOptions;
    ajaxRequest("https://api.pokemontcg.io/v2/supertypes");
}

//make ajax request for type options
function getTypeOptions(){
    ajaxCallback = generateTypeOptions;
    ajaxRequest("https://api.pokemontcg.io/v2/types");
}

//make ajax request for rarity options
function getRarityOptions(){
    ajaxCallback = generateRarityOptions;
    ajaxRequest("https://api.pokemontcg.io/v2/rarities");
}

//generate subtype options in html
//When done get the supertype options
function generateSubTypeOptions(data){
    for(i = 0; i < data.data.length - 1; i++){
        var newOption = document.createElement('option');
        newOption.value = " subtypes:\"" + data.data[i]+"\"";
        newOption.text = "" + data.data[i];
        subtypeSelect.add(newOption);
    }
    ajaxreq = false;
    getSuperTypeOptions();
}

//generate supertype options in html
//When done get the type options
function generateSuperTypeOptions(data){
    for(i=0; i<data.data.length; i++){
        var newOption = document.createElement('option');
        newOption.text = data.data[i];
        newOption.value = " supertype:" + data.data[i];
        supertypeSelect.add(newOption);
    }
    ajaxreq = false;
    getTypeOptions();
}

//generate type options in html
//When done get the rarity options
function generateTypeOptions(data){
    for(i=0; i<data.data.length; i++){
        var newOption = document.createElement('option');
        newOption.text = data.data[i];
        newOption.value = " types:" + data.data[i];
        typeSelect.add(newOption);
    }
    ajaxreq = false;
    getRarityOptions();
}

//generate Rarity Options in html
function generateRarityOptions(data){
    for(i=0; i<data.data.length; i++){
        var newOption = document.createElement('option');
        newOption.text = data.data[i];
        newOption.value = " rarity:\"" + data.data[i] + "\"";
        raritySelect.add(newOption);
    }

    document.getElementById('searchArea').className = "";
}

//Generate the query for the search based on the filter values
function generateQuery(){
    var queryString = "";

    if(searchInput.value == ""){
        queryString += "q=name:*";
    }
    else{
        queryString += "q=name:*" + searchInput.value + "*";
    }

    if(supertypeSelect.value == " supertype:Pokémon"){
        if(minHPFilter.value == "" && maxHPFilter.value == ""){
            //Do Nothing
        }
        else if(minHPFilter.value == ""){
            queryString += " hp:[* TO " + parseInt(maxHPFilter.value) + "]";
        }
        else if(maxHPFilter.value == ""){
            queryString += " hp:[" + parseInt(minHPFilter.value) + " TO *]";
        }
        else{
            queryString += " hp:[" + parseInt(minHPFilter.value) + " TO " + parseInt(maxHPFilter.value) + "]";
        }
    }
    
    queryString += supertypeSelect.value;
    queryString+= typeSelect.value;
    queryString += subtypeSelect.value;
    queryString += raritySelect.value;
    queryString += "&pageSize=" + numPerPageInput.value + "&page=" + pageNum;
    return queryString;
}

//make the ajax call to get a list of cards
function startSearch(){

    var queryString = generateQuery();
    document.getElementById('cardAreaSearch').innerHTML= "<h1>Searching...</h1>";

    ajaxCallback = displayResults;
    ajaxRequest("https://api.pokemontcg.io/v2/cards?" + queryString);
}

//display the results from the search using card template
function displayResults(data){

    var rawTemplate = document.getElementById("cardTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);

    var container = document.getElementById('cardAreaSearch');
    container.innerHTML = "";

    for(i = 0; i < data.data.length; i++){
        container.innerHTML += compiledTemplate(data.data[i]);
    }

    if(data.data.length == 0){
        container.innerHTML = "<h1>No Results Found</h1>"
    }

    totalElements = parseInt(data.totalCount);
    console.log(totalElements);
    var numPerPage = parseInt(numPerPageInput.value);
    console.log(numPerPage);
    totalPages = Math.ceil(parseInt(data.totalCount) / numPerPage);
    console.log(totalPages);
    var lowElement = parseInt((pageNum - 1) * numPerPage + 1);
    console.log(lowElement);
    var highElement = (pageNum - 1) * numPerPage + numPerPage;
    if(highElement > totalElements) highElement = totalElements;
    console.log(highElement);

    document.getElementById('pageButtons').className = "";
    var resultsBox = document.getElementById('resultsArea');

    resultsBox.innerHTML = "";
    resultsBox.innerHTML += "<p>Showing cards: " + lowElement + "-" + highElement + " / " + totalElements + "</p>";
    resultsBox.innerHTML += "<p>Page: " + pageNum + " of " + totalPages + "</p>";

}

//Handlebars helper function to print prices with 2 decimals
Handlebars.registerHelper('decimalFunction', function(number) {
    return parseFloat(number).toFixed(2);
});

//When A show more button is clicked, send request for card info
function showMoreInfo(event){
    document.getElementById('cardAreaSearch').className = "myhide";
    document.getElementById('searchArea').className = "myhide";
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
    document.getElementById('cardAreaSearch').className = "";
    document.getElementById('searchArea').className = "";
    document.getElementById('cardInfoArea').innerHTML = "";
    document.getElementById('cardInfoArea').className = "myhide";
}