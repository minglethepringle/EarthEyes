//from Tensorflow
let net;

async function app() {

  // Load model
  net = await mobilenet.load();


  var imgEl = document.getElementById('img');
  var result = await net.classify(imgEl);
  var guess = result[0];
  var prob = result[0]["probability"];
  document.getElementById("header").textContent = guess["className"];
  console.log(guess);

  //loading.io

}

app();

var update_loop = setInterval(Main, 100);

setTimeout(function () {
  document.getElementById("header").style.display = ""
}, 5000);

Main();

function Main() {
  var headerStyle = document.getElementById("header").style.display;
  if (headerStyle != "none") {
    document.getElementById("loading").style.display = "none";
  } else if (headerStyle == "none") {
    document.getElementById("loading").style.display = "";
  }
}