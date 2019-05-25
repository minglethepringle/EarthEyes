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

function initMap() {
  var lat = 42.363246;
  var lng = -71.3818091;
  var dump = {
    lat: lat,
    lng: lng,
  };

  var map = new google.maps.Map(
    document.getElementById('map'), {
      zoom: 15,
      center: dump
    });
  var marker = new google.maps.Marker({
    position: dump,
    map: map
  });
}