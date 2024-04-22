var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var guessingWord ="";
var lettersInWord=[];
var guessesLeft = 12;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var win;
var wrongGuessedLetters = [];

var cheat = 1;
var cheatListener = document.getElementById('cheatBox').addEventListener("change", cheatFunction);

function startGame() {
   // Fetch a new word from the server
   fetch('getWord.php')
       .then(response => response.json())
       .then(data => {
           if(data.word) {
               document.getElementById("guessedLetters").innerHTML = "";
               wrongGuessedLetters = [];
               guessingWord = data.word;
               if(cheat == -1){
                   alert(guessingWord);
               }
               guessesLeft = 12;
               updateguesses();
               letters = alphabet;
               lettersInWord = [];
               setUpLetters();
               setupGame(data.word);
           } else {
               console.error('Error fetching word:', data.error);
           }
       })
       .catch(error => console.error('Error:', error));
}

function setupGame(word) {
   const wordToGuess = document.getElementById('wordToGuess');
   wordToGuess.innerHTML = '_ '.repeat(word.length).trim();
   generateLetterButtons();
}

function generateLetterButtons() {
    const lettersDiv = document.getElementById('letters');
    lettersDiv.innerHTML = ''; // Clear previous buttons
    var letterIndex = 0;
    for(var row = 0; row < 6; row++){
        if(letterIndex < letters.length){
            var rowDiv = document.createElement("div");
            rowDiv.className = 'letter-row';
            for(var col = 0; col < 5; col++){
                if(letterIndex < letters.length){
                    const button = document.createElement('button');
                    const letter = letters[letterIndex];
                    button.textContent = letter;
                    button.onclick = () => guessLetter(letter);
                    rowDiv.appendChild(button);
                    letterIndex++;
                }
                else{
                    break;
                }
            }
            lettersDiv.appendChild(rowDiv);
        }
    }
}

function guessLetter(letter) {
    var positions = findLetterPositions(guessingWord, letter);
    if(positions.length == 0){
        guessesLeft--;
        updateguesses();
        updateGuessedLetter(letter);
    }
    else{
        updateBoard(positions, guessingWord, letter);
        checkWin();
    }
}

function findLetterPositions(word, letter){
    const positions = [];

    for(var i = 0; i < word.length; i++){
        if(word[i].toLowerCase() == letter.toLowerCase()){
            positions.push(i);
        }
    }

    return positions;

}

function updateBoard(positions, word, letter){
    for(var j = 0; j < positions.length; j++){
        lettersInWord[positions[j]] = "" + letter;
    }
    var stringToPost = lettersInWord.join(" ").trim();
    const lettersDiv = document.getElementById("wordToGuess");
    lettersDiv.innerHTML = stringToPost;
}

function updateguesses(){
    var image = document.getElementById("imageContainer");
    switch(guessesLeft){
        case 12:
            image.style.backgroundImage = "";
            break;
        case 11:
            image.style.backgroundImage = "url('Hangman.jpeg')";
            image.style.backgroundPosition = "-3px -4px";
            break;
        case 10:
            image.style.backgroundPosition = "-80px -4px";
            break;
        case 9:
            image.style.backgroundPosition = "-156px -4px";
            break;
        case 8:
            image.style.backgroundPosition = "-3px -90px";
            break;
        case 7:
            image.style.backgroundPosition = "-80px -90px";
            break;
        case 6: 
            image.style.backgroundPosition = "-156px -90px";
            break;
        case 5:
            image.style.backgroundPosition = "-3px -176px";
            break;
        case 4:
            image.style.backgroundPosition = "-80px -176px";
            break;
        case 3:
            image.style.backgroundPosition = "-156px -176px";
            break;
        case 2:
            image.style.backgroundPosition = "-3px -262px";
            break;
        case 1:
            image.style.backgroundPosition = "-80px -262px";
            break;
        case 0:
            image.style.backgroundPosition = "-156px -262px";
            youLose();
            break;
    }
}

function setUpLetters(){
    for(var i = 0; i < guessingWord.length; i++){
        lettersInWord[i] = "_";
    }
}

function checkWin(){
    win = true;
    
    for(var i = 0; i < lettersInWord.length; i++){
        if(lettersInWord[i] == "_"){
            win = false;
        }
    }
    
    if(win){
        var output = document.getElementById('letters');
        document.getElementById("guessedLetters").innerHTML = "";
        wrongGuessedLetters = [];
        output.innerHTML = "";
        output.innerHTML = "YOU WIN!";
    }
}

function youLose(){
    var output = document.getElementById("letters");
    document.getElementById("guessedLetters").innerHTML = "";
    wrongGuessedLetters = [];
    output.innerHTML = "You lose!<br>The word was " + guessingWord + ".";
}

function updateGuessedLetter(letter){
    wrongGuessedLetters.push(letter);
    var output = document.getElementById("guessedLetters");
    output.innerHTML = "";
    var outputString = wrongGuessedLetters.join(" ").trim();
    output.innerHTML = "Wrong Letters Guessed: " + outputString;
    output.innerHTML += "<br>";
    output.innerHTML += "Guesses Left: " + guessesLeft;
}

function cheatFunction(){
    cheat *= -1;
}