if (!localStorage.getItem('name')) {
  document.getElementById('content').style.display = "none"
} else {
  document.getElementById('picker').style.display = "none"
  document.getElementById('username').value = localStorage.getItem('name');
}

if (localStorage.getUtem('name') !== "Wyatt") {
  document.getElementById('admin').style.display = "none"
});


// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('hello world :o');

let dreams = [];

// define variables that reference elements on our page
const dreamsList = document.getElementById('chat');
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements['msg'];

// a helper function to call when our request for dreams is done
const getDreamsListener = function() {
  // parse our response to convert to JSON
  dreams = JSON.parse(this.responseText);

  // iterate through every dream and add it to our page
  dreams.forEach( function(row) {
    appendNewDream(row.message, row.name);
  });
}

// request the dreams from our app's sqlite database
const dreamRequest = new XMLHttpRequest();
dreamRequest.onload = getDreamsListener;
dreamRequest.open('get', '/getMessages');
dreamRequest.send();

function clearChat() {
  var req = new XMLHttpRequest();
  req.open('post', '/clearChat');
  req.send();
  location.reload()
}

// a helper function that creates a list item for a given dream
const appendNewDream = function(dream, name) {
  var div = document.createElement('div')
  div.class = "message"
  dreamsList.appendChild(div)
  var newListItem = document.createElement('label')
  newListItem.class = "name"
  newListItem.innerHTML = name
  div.appendChild(newListItem);
  var newListItem = document.createElement('p');
  newListItem.class = name
  newListItem.innerHTML = dream;
  div.appendChild(newListItem);
}

var userinput = document.getElementById('userinput')
var pickerform = document.getElementById('pickerform')
pickerform.onsubmit = function(event){
  event.preventDefault()
  localStorage.setItem('name', userinput.value);
  location.reload()
};
