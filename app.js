function InitApp(){
  var that = this;

  pointList = [
    'Ordningsfråga i ordningsfråga',
    'Ordningsfråga om beslutsordningen',
    'Mötesordförande citerar mötesordningen fel',
    'Mikrofonerna strular',
    'Streck i debatten-debatt > 15 min',
    'Okynnesvotering',
    'Rummet är en kvav öken',
    'Någon drar över talartiden och vägrar sluta prata',
    'Årsmötet vill ändra i budgetens personalposter',
    'Personval i rösträknar och/eller justerarval',
    'Folk utan yttranderätt yttrar sig',
    'Röstlängden är felaktig',
    'Proposition saknas',
    'Ingen revisor är på plats',
    'Årsmötet vill bryta mot stadgarna',
    '"På min tid"',
    'Någon däremot? "Nej"',
    '"Finns handlingarna utskrivna någonstans?"',
    'Det saknas kandidater, vakantställning',
    'Det saknas kandidater, golvnominering',
    'Styrelsen hävdar praxis',
    'Årsredovisningen ej färdig',
    'En motion ingen förstår',
    'Någon tar upp en stadgeändring som övrig fråga',
    'Mötesordförande läser upp fel att-sats',
    'Mötesordförande mumlar i rask takt',
    'Något kallas odemokratiskt',
    'Ingen vet vilken version av ett dokument som gäller',
    'För få eluttag',
    'Någon blir mansplainad',
    'Oläsbar powerpoint',
    'Tävling i vem som kan flest svåra ord',
    'Någon hotar med att avgå',
    'Teknikstrul följt av livlig diskussion om lösning',
    'Justerarna lämnar innan mötets slut',
    'Någon kallas rättshaverist',
    'Överkomplicerad energizer',
    'Stadgarna säger emot sig själva',
    'Rösträknarna kommer fram till olika slutsiffror',
    'Någon tar fram basrösten och slår näven i talarstolen',
    'Kaffet tar slut',
    '"Den svenska lagstiftningen för föreningar säger"',
    'Mötesordförande glömmer vilken punkt mötet är på',
    'Wifi strular',
    'Något annat än en ordförandeklubba agerar ordförandeklubba',
    'Någons telefon ringer under beslut',
    'Rösträknarna glömmer att meddela resultat av sluten omröstning',

    //Set 2
    'Mötesordförande suckar högljutt åt någons förslag',
    'Någon har tappat bort sitt röstkort',
    'Röstlängden justeras två gånger inom en timme',
    'Maten är försenad/kan vi skjuta på maten så vi blir klara',
    'Folk utan yrkanderätt yrkar',
    'Folk utan rösträtt röstar',

    //Set 3
    'Talarlisteskämt ingen skrattar åt',
    'Det tar lite för lång tid för årsmötet att komma ihåg vilka valberedarna är',
    'Mötesordförande börjar argumentera för en ståndpunkt i sakfråga',
  ];

  rngEngine = new RNGSUS();
  drawEngine = new Drawer();
  dialogue = new Dialogue();
  winner = new CheckWinConditions();

  seed = findGetParameter("id");

  if (seed === null || rngEngine.validateSeed(seed) === false){
    seed = rngEngine.newSeed();
  }
  seedNumber =  parseInt(seed, 16);
  drawEngine.loadUI();

  squareInt = 5;
  randomized = rngEngine.give(pointList, squareInt);

  if(randomized !== null && squareInt !== null){
    drawEngine.createBoard(randomized, squareInt);
  }

  var cookieString = decodeURIComponent(document.cookie);
  cookieString = cookieString.split(";");
  cookies = {};
  for(var i in cookieString){
    var p = cookieString[i].split("=");
    if(p.length === 2){
      var cookieObj = new Object();
      cookieObj.name = p[0];
      cookieObj.value = p[1];
      cookies[p[0]] = p[1];
    }
  }

  if(cookies.readDisclaimer !== "true"){
    //dialogue.disclaimer();
  }
  if(cookies.readCookies !== "true"){
    //dialogue.cookies();
  }
}

function CheckWinConditions(){
  var that = this;
  this.check = function(){
    var board = $('.bingoBoard');
    if (board.length === 1){
      board = board[0];
      var rows = tableRowsToBools(board.children[0].children);
      var cols = rowsToCols(rows);
      if (bCheckData(rows) || bCheckData(cols)){
        console.log("BINGO");
        drawEngine.celebrate();
      }
    }
  }
  function bCheckData(input = null){
    if(input !== null){
      for(var i in input){
        var counter = 0;
        var row = input[i]
        for(var b in row){
          if(row[b] === 1){
            counter++;
          }
        }
        if(counter === row.length){
          return true;
        }
      }
    }
    return false;
  }
  function tableRowsToBools(input = null){
    if(input !== null){				//I'm lazy, ok?
    var output = [];
      for(var i=0;i < input.length;i++){
        var colArr = [];
        for(var b=0; b < input[i].children.length;b++){
          if(input[i].children[b].classList.contains("marked")){ // Fixed properly now
            colArr.push(1);
          }else{
            colArr.push(0);
          }
        }
        output.push(colArr);
      }
      return output;
    }
  }
  function rowsToCols(input = null){ //input = row
    if(input !== null){
      var output = [];
      for(var i in input){
        var colData = [];
        var row = input[i];
        for(var b in input){
          colData.push(input[b][i])
        }
        output.push(colData)
      }
      return output;
    }
  }
}

function Dialogue(){
  var that = this;

  function drawDiag(title,content){
    var diag = $('<div>').attr("id","dialogue").attr("title",title).html(content);
    $('body').append(diag);

    $(function() {
      $( "#dialogue" ).dialog({
        autoOpen: false,
        modal: true,
        width: 500,
        buttons: {
          OK: function(){
            $(this).dialog("close");
            $("#dialogue").remove();
          }
        },
      });
    });
    $( "#dialogue" ).dialog( "open" );
  };

  this.boards = function(){
    var title = "Brickor";
    var content = $('<div>').css({width:"100%",height:"350px", overflow:"auto"});

    content.append($('<p>').text("Just nu så finns " + pointList.length + " stycken olika saker som kan hamna på bingobrickan\nFler saker kan tillkomma framöver, samt funktionen att välja vilka som är möjliga att få med i sin bricka."));

    for(var i in pointList){
      content.append($('<p>').text(pointList[i]));
    }

      drawDiag(title, content);
      //document.cookie = "readDisclaimer=true";
  };

  this.disclaimer = function(){
    var title = "Disclaimer";
    var content = $('<div>').css("width","100%");

    content.append($('<p>').text("Det här är HUMOR.\n\nListan kan med fördel användas av folk som varit på för många årsmöten och är lite trötta på saker som inte fungerar.\n\nEtt sätt att avreagera sig utan att alla andra får lida för det helt enkelt.\n\nAnvändningsområden som ej rekommenderas är att bocka av så mycket som möjligt och sedan använda den för att kritisera mötet. Det är inte bara drygt, det är också förbannat opedagogiskt."));
    drawDiag(title, content);
    document.cookie = "readDisclaimer=true";
  };

  this.about = function(){
    var title = "Om";
    var content = $('<div>').css("width","100%");

    content.append($('<span>').html('Den här sidan är baserad på en bingobricka framställd av <a href="https://twitter.com/garpebring/status/982699960830431236">Mimmi Garpebring</a> i samband med en gruppchatt mellan Mimmi, Saga Hedberg och Erik Einarsson.<br /><br />När Mimmi inte hittade någon bra bingogenerator på nätet så fick <a href="https://twitter.com/einarssonerik">Erik</a> den briljanta idén att bygga ihop det själv, glatt påhejad av Mimmi och Saga.<br /><br />Det är resultatet av detta som ni nu bevittnar här.<br /><br />Feature requests skickas till <a href="mailto:erik@avgåalla.nu">erik@avgåalla.nu</a>, nya saker att lägga in på brickorna genom att besvara <a href="https://twitter.com/garpebring/status/982699960830431236">denna Tweet</a>, buggrapporter hanteras på <a href="https://twitter.com/einarssonerik">Twitter</a>, klagomål på koncept/layout/annat skickas till <a href="mailto:dev/null@avgåalla.nu">dev/null@avgåalla.nu</a> där det kommer hanteras enligt <a href="https://en.wikipedia.org/wiki/Null_device">etablerad praxis</a>.'))
    drawDiag(title, content);
  };

  this.winMsg = function(){
    var title = "Grattis... eller nåt?";
    var content = $('<div>').css("width","100%");

    content.append($('<span>').html(''))
    drawDiag(title, content);
  };

  this.cookies = function(){
    var title = "Kakor";
    var content = $('<div>').css("width","100%");

    content.append($('<p>').text("Den här sidan använder kakor för att spara information.\nOm du inte gillar det så kan du ta bort dom själv i din webbläsare och låta bli att besöka den igen."))

    drawDiag(title, content);
  };

  this.license = function(){
    var title = "Licens";
    var content = $('<div>').css("width","100%");

    content.append($('<p>').text('Copyright 2018 Erik Einarsson\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.'))

    content.append($('<span>').html('Läs mer om MIT-Licensen på Internet.<br /><br />Sidan använder externa biblioteken jQuery, jQueryUI samt <a href="https://www.npmjs.com/package/confetti-js">confetti-js</a>.<br />Källkoden finns på <a href="https://github.com/zirne/meeting-bingo">GitHub</a>.'))

    drawDiag(title, content);
  };
}

function RNGSUS(){
  var that = this;

  this.newSeed = function(){
    var str = Math.random().toString(16).split(".")[1];
    setUriParam(str);
    return str;
    //console.log(str);
  }
  this.validateSeed = function(testSeed = null){
    if(testSeed !== null){
      var re = new RegExp(/^[\da-f]*$/);
      //console.log("babar");
      return re.test(testSeed);
    } else {
      return false;
    }
  }

  this.give = function(inputArray = null, amount){ //inputArray = list of things to pick from, amount = number of things to return
    if(inputArray !== null && amount !== null && inputArray.length >= amount*amount){
      inputArray = shuffle(inputArray);
      var totalCount = amount * amount;
      var outArray = [];
      for (var i = 0; i < totalCount;i++){
        outArray.push(inputArray[i])
      }
      return outArray;
    }
    return null;
  };
  function amountChecker(amount = null){ //TODO check that amount is reasonable
    if(Number.isInteger(amount)){

    }
  }
  function shuffle(array) {
    if(seed === null || rngEngine.validateSeed(seed) !== true){//IF FOR SOME REASON THIS HAPPENS, WTF?
      seed = rngEngine.newSeed();
    }
    var currentIndex = array.length, temporaryValue, randomIndex;

    //Seed Handler for Pseudo-randomness
    let pseudoRandom = function() {
      var x = Math.sin(seedNumber++) * 10000;
      return x - Math.floor(x);
    };

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(pseudoRandom() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}

function Drawer(){
  var that = this;

  this.celebrate = function(){
    console.log("TIME TO CELEBRATE!")
    if($('#rain').length === 0){
      $('body').append($('<canvas>').attr("id","rain").css({
        position:"fixed",
        top:"0",
        left:"0",
        width:"100%",
        height:"100%",
        "z-index":"-1"
      }))
      console.log("CONFETTI!");
      try { //If the required library exists, we can run this
        var confettiSettings = {"target":"rain","max":"80","size":"3","animate":true,"props":["square","line"],"colors":[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],"clock":"25"};
        var confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
      }
      catch(err) {
        console.log(err.message);
      }
    }
  };

  this.changeStatus = function(data = null){
    if(data !== null){
      var data = $(data);
      if(data.hasClass("unmarked") || data.hasClass("marked")){
        if(data.hasClass("unmarked")){
          data.removeClass("unmarked");
          data.addClass("marked");
        } else if(data.hasClass("marked")) {
          data.removeClass("marked")
          data.addClass("unmarked")
        }
        winner.check();
      }
    }
  };

  this.header = function(){
    var div = $('<div>').attr("id","header");
    div.append($('<h1>').text("Mötesbingo - när du känner att alla måste avgå"))
    return div;
  };

  this.content = function(){
    var div = $('<div>').attr("id","content");
    return div;
  };

  this.footer = function(){
    var div = $('<div>').attr("id","footer");
    div.append($('<a>').addClass("footerLink").attr("href","#").text("Om").attr("onclick","dialogue.about()"));
    div.append($('<a>').addClass("footerLink").attr("href","#").text("Disclaimer").attr("onclick","dialogue.disclaimer()"));
    div.append($('<a>').addClass("footerLink").attr("href","#").text("Licens").attr("onclick","dialogue.license()"));
    div.append($('<a>').addClass("footerLink").attr("href","#").text("Kakor").attr("onclick","dialogue.cookies()"));
    div.append($('<a>').addClass("footerLink").attr("href","#").text("Möjliga brickor").attr("onclick","dialogue.boards()"));
    return div;
  };

  this.loadUI = function(){
    $('body').empty();
    var main = $('<div>').attr("id","main");
    var header = this.header();
    var content = this.content();
    var footer = this.footer();

    main.append(header).append(content).append(footer);
    $('body').append(main);
  };

  this.createBoard = function(input, columns){
    $('#content').empty();
    var table = $('<table>').addClass("bingoBoard");
    var counter = 0;
    for(var i = 0;i < columns;i++){
      var row = $('<tr>').addClass("boardRow");
      for(var b = 0;b < columns;b++){
        var cell = $('<td>').addClass("boardCell").click(function(){drawEngine.changeStatus(this);}).addClass("unmarked");//12vmin in org
        cell.append($('<p>').addClass("pointText").text(input[counter]))//12px in org
        counter++;
        row.append(cell);
      }
      table.append(row);
    }
    $('#content').append(table);

    //Append Button
    $('#content').append($('<button>').addClass("generateBoard").click(function(){seed = rngEngine.newSeed(); drawEngine.createBoard(rngEngine.give(pointList, squareInt), squareInt);}).text("Slumpa fram ny bricka"))
  }
}

function findGetParameter(parameterName) {//Shamelessly borrowed from Eric Nguyen
var result = null,
    tmp = [];
location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
return result;
}

function setUriParam(str){
  window.history.pushState('','',"?id=" + encodeURIComponent(str))
}


$(InitApp);
