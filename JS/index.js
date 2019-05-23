//from Tensorflow
let net;

async function app() {

  // Load model
  net = await mobilenet.load();

  var loading = true;

  var imgEl = document.getElementById('img');
  var result = await net.classify(imgEl);
  var guess = result[0];
  var prob = result[0]["probability"];
  document.getElementById("header").textContent = "why so slow";

  var headerStyle = document.getElementById("header").style.display;
  console.log(headerStyle);
  if (headerStyle != "none") {
    document.getElementById("loading").style.display = "none";
  } else if (headerStyle == "none") {
    document.getElementById("loading").style.display = "";
    console.log("here");
  }

  //loading.io

}

app();