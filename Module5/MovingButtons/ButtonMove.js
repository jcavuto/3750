var startbtn = document.getElementById("makeBtn");
startbtn.addEventListener("click", generateBtn);

var numBtn = 0;
var butCount = 0;
var pauseresumetoggle = 0;
var movingButtonsInterval;
var sum = 0;

document.getElementById('sum').innerHTML = "<br>Sum Total:<br>" + sum;
var pauseresume = document.getElementById("pauseresume");
pauseresume.addEventListener("click", pauseresumeFunction);

function generateBtn(){
    butCount++;
    var buttonCount0 = "Button Count:<br>" + butCount;
    document.getElementById("ButtonCount").innerHTML = buttonCount0;;
    
    var color = document.getElementById("colors").value;
    var btn = document.createElement("button");

    btn.innerHTML = Math.floor(Math.random() * 99) + 1;
    btn.style.position = "absolute";
    var x_pos = Math.floor(Math.random() * 101);
    var y_pos = Math.floor(Math.random() * 99);

    btn.style.left = x_pos + '%';
    btn.style.top = y_pos + '%';
    btn.style.backgroundColor = color;
    if(color == "white" || color == "yellow"){
        btn.style.color = "black";
    }
    else{
        btn.style.color = "white";
    }
    btn.className = "movingButton";
    btn.id = numBtn++;
    btn.xincrement = Math.random() < 0.5 ? 1 : -1;
    btn.yincrement = Math.random() < 0.5 ? 1 : -1;
    document.getElementById("buttonArea").appendChild(btn);

    btn.onclick = function()   {
        console.log(this.id);
        var color = document.getElementById("colors").value;
        this.style.backgroundColor = color;
        sum += parseInt(this.innerHTML);
        document.getElementById('sum').innerHTML = "<br>Sum Total:<br>" + sum;
    }
}

function pauseresumeFunction(){
    if (pauseresumetoggle == 0) {
        pauseresumetoggle = 1;
        pauseresume.innerHTML = "PAUSE";
        movingButtonsInterval = setInterval(moveButtons, 100);
    }
    else {
        pauseresumetoggle = 0;
        pauseresume.innerHTML = "MOVE";
        clearInterval(movingButtonsInterval);
    }
}

function moveButtons(button)   {
    var buttons = document.querySelectorAll('.movingButton');
    buttons.forEach(function (button) {
        var currentxPosition = parseInt(button.style.left);
        var currentyPosition = parseInt(button.style.top);
        var newxPosition = currentxPosition + button.xincrement;
        var newyPosition = currentyPosition + button.yincrement;

        if (newxPosition == 0 || newxPosition == 99) {
            button.xincrement *= -1; // Reverse direction
        } else {
            button.style.left = newxPosition + '%';
        }
        if(newyPosition < 0 || newyPosition > 97)   {
            button.yincrement *= -1;
        }
        else{
            button.style.top = newyPosition + '%';
        }
    });
}
