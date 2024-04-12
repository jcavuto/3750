var cards = new Array();
numNames = 0;

document.getElementById("submit").addEventListener("click", addCard);
document.getElementById("print").addEventListener("click", printCards);
document.getElementById("inputform").addEventListener("keypress", enterkey);
document.getElementById("clearform").addEventListener("click", clearForm);
document.getElementById("clearcards").addEventListener("click", clearCards);

function printCard() {
   var nameLine = "<br><hr><strong>Name: </strong>" + this.name + "<br>";
   var emailLine = "<strong>Email: </strong>" + this.email + "<br>";
   var addressLine = "<strong>Address: </strong>" + this.address + "<br>";
   var phoneLine = "<strong>Phone: </strong>" + this.phone + "<hr>";
   var birthdayLine = "<strong>Birthday: </strong>" + this.birthday + "<hr>";
   var fullAppend = nameLine + emailLine + addressLine + birthdayLine;
   document.getElementById("cardarea").innerHTML += fullAppend;
}

function Card(name,email,address,phone, birthday) {
   this.name = name;
   this.email = email;
   this.address = address;
   this.phone = phone;
   this.birthday = birthday;
   this.printCard = printCard;
}

function addCard()   {
   var name = document.getElementById("name").value;
   var email = document.getElementById("email").value;
   var address = document.getElementById("address").value;
   var phone = document.getElementById("phone").value;
   var birthday = document.getElementById("birthday").value;

   var invalid = "";

   if(name == ""){
      invalid += "No name entered\n";
   }
   if(email == ""){
      invalid += "No email entered\n";
   }
   if(phone == ""){
      invalid += "No phone entered\n";
   }

   if(address == ""){
      invalid += "No address entered\n";
   }

   if(birthday == ""){
      invalid += "No birthday entered\n";
   }

   if(name == "" || email == "" || phone == "" || address == "" || birthday == ""){
      alert(invalid);
   }
   else{
      var newCard = new Card(name, email, address, phone, birthday);
      cards[numNames] = newCard;
      numNames++;
      clearForm();
   }
}

function printCards(){
   document.getElementById("cardarea").innerHTML = "";
   for(var i = 0; i < numNames; i++)   {
      cards[i].printCard();
   }
}

function enterkey(event){
   if(event.key == 'Enter'){
      event.preventDefault();
      addCard();
  }
}

function clearForm(){
   document.getElementById("name").value = "";
   document.getElementById("email").value = "";
   document.getElementById("address").value = "";
   document.getElementById("phone").value = "";
   document.getElementById("birthday").value = "";
}

function clearCards(){
   cards = [];
   numNames = 0;
   printCards();
}


