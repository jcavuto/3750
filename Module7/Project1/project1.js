
// Set up an interval to update the display time every 50 milliseconds
var curTimeInterval = setInterval(displayTime, 50);

// Get the audio element
var audio = document.getElementById("audioPlayer");

// Array to store titles
var arrayOfTitles=[];


// Variable to hold the current event listener for time updates
var currentEventListener = null;

// Toggle variable for play/pause button
var playpauseToggle = 0;

// Set up an interval to print titles every second
var TitleInterval = setInterval(printTitles, 1000);

// Event listener for play/pause button
var playpause = document.getElementById("playpause");
playpause.addEventListener("click", playpauseFunction);

// Event listener for skip 5 seconds button
var skip5 = document.getElementById("skip5");
skip5.addEventListener("click", skip5Function);

// Event listener for rewind 5 seconds button
var rewind5 = document.getElementById("rewind5");
rewind5.addEventListener("click", rewind5Function);

// Event listener for add title button
var addTitleButton = document.getElementById("addTitle");
addTitleButton.addEventListener("click", addTitle);

// Event listener for input field for adding new title
var newTitle = document.getElementById("newTitle");
newTitle.addEventListener("keypress", inputEnter);

// Predefined titles with corresponding timestamps
arrayOfTitles.push(new Title("Intro + Verse 1", 0));
arrayOfTitles.push(new Title("Verse 2", 45));
arrayOfTitles.push(new Title("Pre-Chorus 1", 76));
arrayOfTitles.push(new Title("Chorus 1", 91));
arrayOfTitles.push(new Title("Verse 3", 111));
arrayOfTitles.push(new Title("Pre-Chorus 2", 172));
arrayOfTitles.push(new Title("Chorus 2", 187));
arrayOfTitles.push(new Title("Bridge 1", 243));
arrayOfTitles.push(new Title("Verse 4", 285));
arrayOfTitles.push(new Title("Verse 5", 362));
arrayOfTitles.push(new Title("Chorus 3", 404));
arrayOfTitles.push(new Title("Verse 6", 442));
arrayOfTitles.push(new Title("Outro", 494));

// Function to toggle play/pause
function playpauseFunction(){
    if(playpauseToggle == 0) {
        audio.play();
        playpauseToggle = 1;
        playpause.src = "Images/Pause.png";
    }
    else{
        audio.pause();
        playpauseToggle = 0;
        playpause.src = "Images/Play.png";
    }
}

// Function to skip forward 5 seconds
function skip5Function(){
    if (currentEventListener) {
        audio.removeEventListener("timeupdate", currentEventListener);
    }

    audio.currentTime += 5;
}

// Function to rewind 5 seconds
function rewind5Function(){
    if (currentEventListener) {
        audio.removeEventListener("timeupdate", currentEventListener);
    }

    audio.currentTime -= 5;
}

// Function to display current time and duration
function displayTime() {
    var curTime = "" + Math.floor(audio.currentTime / 60) + ":" + (Math.floor(audio.currentTime % 60) < 10 ? ("0" + Math.floor(audio.currentTime % 60)) : (Math.floor(audio.currentTime % 60)));
    var duration = "" + Math.floor(audio.duration / 60) + ":" + Math.floor(audio.duration % 60);
    var output = "Time: " + curTime + " / " + duration;
    document.getElementById("time").innerHTML = output;
}

// Function constructor for Title object
function  Title(name, time) {
    this.name = name;
    this.time = time;
    this.position = 0;
    this.printTitle = printTitle;
    this.printTimestamp = printTimestamp;
}

// Function to print titles and timestamps
function printTitles(){
    document.getElementById("titles").innerHTML = "";
    for(var i = 0; i < arrayOfTitles.length; i++){
        var title = arrayOfTitles[i].printTitle();
        arrayOfTitles[i].position = i;
        var timestamp = arrayOfTitles[i].printTimestamp();
        var newCard = document.createElement("div");
        var removeButton = document.createElement("img");
        removeButton.src = "Images/Remove.png";
        removeButton.position = arrayOfTitles[i].position;
        removeButton.onclick = function(event){
            event.stopPropagation();
            removeTitle(this.position);
        }
        newCard.className = "title";
        newCard.innerHTML = title + timestamp;
        newCard.position = arrayOfTitles[i].position;
        newCard.onclick = function(){
            goToTimestamp(this.position);
        }
        if(audio.currentTime >= arrayOfTitles[i].time && i < arrayOfTitles.length - 1 && audio.currentTime < arrayOfTitles[i+1].time ){
            newCard.style.backgroundColor = "pink";
            newCard.style.color = "black";
        }
        else if(i == arrayOfTitles.length - 1 && audio.currentTime >= arrayOfTitles[i].time){
            newCard.style.backgroundColor = "pink";
            newCard.style.color = "black";
        }
        newCard.appendChild(removeButton);
        document.getElementById("titles").append(newCard);
    }
}

// Function to print title name
function printTitle(){
    var title = "<h1>" + this.name + "</h1>";
    return title;
}

// Function to print timestamp
function printTimestamp(){
    var timestamp = "<p>" + Math.floor(this.time / 60) + ":" + (Math.floor(this.time % 60) < 10 ? ("0" + Math.floor(this.time % 60)) : (Math.floor(this.time % 60))) + "</p>";
    return timestamp;
}

// Function to go to a specific timestamp
function goToTimestamp(position){
    if(playpauseToggle == 0) {
        playpauseToggle = 1;
        playpause.src = "Images/Pause.png";
    }

    var pos = parseInt(position);
    audio.currentTime = arrayOfTitles[pos].time;
    audio.play();

    if (currentEventListener) {
        audio.removeEventListener("timeupdate", currentEventListener);
    }

    currentEventListener = function stopAtNextPosition() {
        if (position < arrayOfTitles.length - 1 && audio.currentTime >= arrayOfTitles[position + 1].time) {
            audio.pause();
            audio.removeEventListener("timeupdate", stopAtNextPosition);
            if(playpauseToggle == 1) {
                playpauseToggle = 0;
                playpause.src = "Images/Play.png";
            }
        }
    };

    audio.addEventListener("timeupdate", currentEventListener);
}

// Event listener for pressing enter in input field
function inputEnter(event){
    if(event.keyCode == 13){
        addTitle();
    }
}

// Function to add a new title
function addTitle(){
    var responseArea = document.getElementById("responsemessage");
    responseArea.innerHTML = "";
    responseArea.style.backgroundColor = "";
    responseArea.style.color = "";

    if(arrayOfTitles.length == 50){
        responseArea.innerHTML = "MAX 50 Titles Reached";
        responseArea.style.backgroundColor = "red";
        responseArea.style.color = "white";
    }
    else{
    
        var newName = document.getElementById("newTitle").value;
        var currentTime = audio.currentTime;
        var errorCode = 0;
        var errorMessage = "";

        if(newName == ""){
            responseArea.innerHTML = "No Title Given";
            responseArea.style.backgroundColor = "red";
            responseArea.style.color = "white";
        }
        else{

            for(var i = 0; i < arrayOfTitles.length; i++){
                if(arrayOfTitles[i].name == newName && arrayOfTitles[i].time == currentTime){
                    errorCode = 1;
                }
                else if(arrayOfTitles[i].time == currentTime){
                    errorCode = 2;
                }
                else if(arrayOfTitles[i].name == newName){
                    errorCode = 3;
                }
            }
            if(errorCode == 1){
                errorMessage = "That title name already exists<hr>";
                errorMessage += "There already exists a Title at: ";
                errorMessage += Math.floor(audio.currentTime / 60) + ":" + (Math.floor(audio.currentTime % 60) < 10 ? ("0" + Math.floor(audio.currentTime % 60)) : (Math.floor(audio.currentTime % 60)));
                
                responseArea.style.backgroundColor = "red";
                responseArea.style.color = "white";

                responseArea.innerHTML = errorMessage;

            }
            else if(errorCode == 2){
                errorMessage = "There already exists a Title at: ";
                errorMessage += Math.floor(audio.currentTime / 60) + ":" + (Math.floor(audio.currentTime % 60) < 10 ? ("0" + Math.floor(audio.currentTime % 60)) : (Math.floor(audio.currentTime % 60)));
                
                responseArea.style.backgroundColor = "red";
                responseArea.style.color = "white";

                responseArea.innerHTML = errorMessage;
            }
            else if(errorCode == 3){
                errorMessage = "That title name already exists";
                responseArea.style.backgroundColor = "red";
                responseArea.style.color = "white";
                responseArea.innerHTML = errorMessage;
            }
            else{
                var newTitle = new Title(newName, audio.currentTime);
                arrayOfTitles.push(newTitle);
                arrayOfTitles.sort(function(a, b) {
                    return a.time - b.time;
                });
            }
        }
    }

    document.getElementById("newTitle").value = "";
}

// Function to remove a title
function removeTitle(pos){
    var position = pos;

    if(arrayOfTitles.length == 7){
        alert("MIN 7 Titles Reached");

    }
    else{

        for(var i = position; i < arrayOfTitles.length - 1; i++){
            arrayOfTitles[i] = arrayOfTitles[i+1];
            arrayOfTitles[i].position = i;
        }

        arrayOfTitles.pop();
    }
}