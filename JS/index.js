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
  
  console.log(guess);
  if (prob >= .4 ){ //reduce false positives
    validate = true;
    //pass this to Earth911 APIs
    //add sending DIY video kek
    console.log("");
    document.getElementById("header").innerHTML=guess["className"];


    var loading = false;
    var huh = (document.getElementById("header").style.display);
    if (huh == "none"){
      console.log("woah");
      document.getElementById("loading").style.display = "";
    }
  else{
    //request user for their descriptions
    document.getElementById("header").innerHTML="wut is this";

  }

}
}
app();
