//from Tensorflow
let net;

async function app() {

  // Load model
  net = await mobilenet.load();

  var imgEl = document.getElementById('img');
  var result = await net.classify(imgEl);
  
  var guess = result[0];
  var prob = result[0]["probability"];
  var className = result[0]["className"];
  var validate = false;
  console.log(guess);
  if (prob >= .4 ){ //reduce false positives
    validate = true;
    //pass this to Earth911 API
    //add sending DIY video kek
    console.log("");
    document.getElementById("header").innerHTML=guess["className"];
  }
  else{
    //request user for their descriptions
    document.getElementById("header").innerHTML="wut is this";

  }

}

app();
