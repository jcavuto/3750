// initialize the counter and the array
var numbernames=0;
var names = new Array();
var count = 0;
function SortNames() {
    document.theform.sorted.innerHTML = "";
   // Get the name from the text field
   thename=document.theform.newname.value.toUpperCase();
   // Add the name to the array
   names[numbernames]=thename;
   // Increment the counter
   numbernames++;
   // Sort the array
   names.sort();

   for(var count = 0; count < numbernames; count++)   {
    document.theform.sorted.append((count + 1) + ": " + names[count] + "\n");
   }
}

document.getElementById("newname").addEventListener('keypress', enterPress);

function enterPress(event){
    if(event.key == 'Enter'){
        event.preventDefault();
        SortNames(event);
        document.getElementById("newname").value = "";
    }
}