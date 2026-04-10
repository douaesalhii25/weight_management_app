// ---------------- LOGIN FUNCTION ----------------
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let error = document.getElementById("error");

  let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (!email.match(emailPattern)) {
    error.innerText = "Invalid email format";
    return;
  }

  if (password.length < 8) {
    error.innerText = "Password must be 8+ characters";
    return;
  }

  localStorage.setItem("user", email);
  window.location.href = "index.html";
}


// ---------------- INDEXEDDB (PASTE YOUR CODE HERE) ----------------
let db;

let request = indexedDB.open("WeightDB", 1);

request.onupgradeneeded = function (e) {
  db = e.target.result;
  db.createObjectStore("weights", { autoIncrement: true });
};

request.onsuccess = function (e) {
  db = e.target.result;
  displayWeights();
};

function addWeight() {
  let weight = document.getElementById("weight").value;

  let tx = db.transaction("weights", "readwrite");
  let store = tx.objectStore("weights");

  store.add(weight);

  tx.oncomplete = function () {
    displayWeights();
  };
}
function displayWeights() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let tx = db.transaction("weights", "readonly");
  let store = tx.objectStore("weights");

  let request = store.openCursor();

  let weights = [];

  request.onsuccess = function (e) {
    let cursor = e.target.result;

    if (cursor) {
      weights.push(cursor.value);

      let li = document.createElement("li");
      li.innerText = cursor.value;
      list.appendChild(li);

      cursor.continue();
    } else {
      drawChart(weights);
    }
  };
}

function drawChart(data) {
  let canvas = document.getElementById("chart");
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, 200 - data[0]);

  for (let i = 1; i < data.length; i++) {
    ctx.lineTo(i * 30, 200 - data[i]);
  }

  ctx.stroke();
}