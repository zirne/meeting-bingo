function diag(){
  var space = {};
  space["width"] = window.screen.width;
  space["height"] = window.screen.height;
  space["wNm"] = window.screen.width*window.devicePixelRatio;
  space["hNm"] = window.screen.height*window.devicePixelRatio;
  space["pixelRatio"] = window.devicePixelRatio;
  space["zoomFactor"] = parseInt(window.devicePixelRatio*100)+"%";
  space["innerWidth"] = window.innerWidth;
  space["innerHeight"] = window.innerHeight;

  var platform = {};
  platform["os"]=navigator.oscpu;
  platform["platform"]=navigator.platform;
  platform["browser"]=navigator.userAgent
  platform["maxTouchPoints"]=navigator.maxTouchPoints;
  platform["language"]=navigator.language;

  //output
  function checkIfLive(){
    var d = window.location.hostname;
    var c = 0;
    if(d === "avgaalla.nu" || d === "xn--avgalla-gxa.nu"){
      return true;
    }
    return false;
  }

  if (findGetParameter("debug") || checkIfLive() === false){
    for(var i in space){
      console.log(i+"="+space[i]);
    }
    for(var i in platform){
      console.log(i+"="+platform[i]);
    }
  }

  if (findGetParameter("debug")){
    console.log("debug=true");
    var debugDiv = $("<div>");
    var debugText = $("<p>");
    var tString = "";
    for(var i in space){
      //debugDiv.append($("<p>").text(i+"="+space[i]));
      tString = tString + i+"="+space[i]+",";
    }
    for(var i in platform){
      //debugDiv.append($("<p>").text(i+"="+platform[i]));
      tString = tString + i+"="+platform[i]+",";
    }
    debugText.text(tString);
    debugDiv.append(debugText);

    setTimeout(function(){$('#content').append(debugDiv)},1000);
  }
}

diag();
