pointList = [ // Global due to creating possibilities to edit this in separate file
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
    'Mötesordförande suckar högljutt åt någons förslag',
    'Någon har tappat bort sitt röstkort',
    'Röstlängden justeras två gånger inom en timme',
    'Maten är försenad/kan vi skjuta på maten så vi blir klara',
    'Folk utan yrkanderätt yrkar',
    'Folk utan rösträtt röstar',
    'Talarlisteskämt ingen skrattar åt',
    'Det tar lite för lång tid för årsmötet att komma ihåg vilka valberedarna är',
    'Mötesordförande börjar argumentera för en ståndpunkt i sakfråga',
];

function findGetParameter(parameterName) {
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

function setGetParameter(key, val) {
    window.history.pushState('', '', "?" + key + "=" + encodeURIComponent(val))
}

function generateSeed() {
    return Math.random().toString(16).split(".")[1];
}

function setNewSeed() {
    let seed = generateSeed()
    setGetParameter('board', seed)
    return seed
}

function seedToInt(seed) {
    return parseInt(seed, 16);
}

function validateSeed(seed) {
    var re = new RegExp(/^[\da-f]*$/);
    return (seed !== '' && seed !== undefined && seed !== null && re.test(seed));
}

function shuffleArray(array, seed) {
    // Seed has to be an int in this iteration
    let currentIndex = array.length, temporaryValue, randomIndex;

    //Seed Handler for Pseudo-randomness
    let pseudoRandom = function () {
        let x = Math.sin(seed++) * 10000;
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

function createBoard(seed, input, layout) {
    let seedNum = seedToInt(seed) + layout // For more pseudo-randomness
    let board_data = shuffleArray(input, seedNum)
    board_data = board_data.slice(0, layout * layout)
    let retval = []
    for (let i = 0; i < board_data.length; i++) {
        retval.push({
            'text': board_data[i],
            'checked': false
        });
    }
    return retval
}

function setLocalBoard(data) {
    window.localStorage.setItem(findGetParameter('board'), JSON.stringify(data))
}

function getLocalBoard() {
    return JSON.parse(window.localStorage.getItem(findGetParameter('board')))
}

function SetupData(points = null) {
    // Should ensure that a data object is setup in local storage
    // Should contain an object containing board_id, board_data, and layout
    if (points === null) {
        points = pointList
    }

    let board_id = findGetParameter('board') || setNewSeed()
    board_id = (validateSeed(board_id)) ? board_id : setNewSeed() // Validation
    let layout = findGetParameter('layout') || 5
    layout = (layout <= 6) ? layout : 5;  // Auto-limit to 5 if too big


    if (window.localStorage.getItem(board_id)) {
        return window.localStorage.getItem(board_id)
    }

    let data = {
        'board_id': board_id,
        'layout': layout,
        'board': createBoard(board_id, points, layout),
        'won': false
    }
    setLocalBoard(data)
}
function DrawBoardInConsole() {
    let board = getLocalBoard()
    c = 0;
    for (let i = 0; i < board.layout; i++) {
        let row = []
        for (let i2 = 0; i2 < board.layout; i2++) {
            let p_val = (board.board[c].checked) ? "[x]" : "[ ]"
            row.push(p_val)
            c++;
        }
        console.log(row)
    }
}
const everyNth = (arr, nth, offset) => arr.filter((e, i) => i % nth === nth - 1 - offset);

function checkRows(arr, len) {
    c = 0;
    for (let i = 0; i < len; i++) {
        let row = []
        for (let i2 = 0; i2 < len; i2++) {
            row.push(arr[c].checked)
            c++;
        }
        if (row.every(function (data) {
            return data;
        })) {
            return true;
        }
    }
    return false;
}

function checkCols(arr, len) {
    for (let i = 0; i < len; i++) {
        col = everyNth(arr, len, i)
        if (col.every(function (data) {
            return data.checked;
        })) {
            return true;
        }
    }
    return false
}

function TriggerBingo() {
    setTimeout(function () {
        if ($('#rain').length === 0) {
            $('body').append($('<canvas>').attr("id", "rain").css({
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                "z-index": "-1"
            }))
            console.log("CONFETTI!");
            try { //If the required library exists, we can run this
                var confettiSettings = { "target": "rain", "max": "80", "size": "3", "animate": true, "props": ["square", "line"], "colors": [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]], "clock": "25" };
                var confetti = new ConfettiGenerator(confettiSettings);
                confetti.render();
            }
            catch (err) {
                console.log('The Confetti is a lie.')
            }
        }
        drawWinMessage()
    }, 500);
}

function CheckWinConditions() {
    let board = getLocalBoard()
    let row_check = checkRows(board.board, board.layout)
    let col_check = checkCols(board.board, board.layout)
    if (row_check || col_check) {
        if (board.won === false) {
            TriggerBingo()
            board.won = true
            setLocalBoard(board)
        }
    } else {
        board.won = false
        setLocalBoard(board)
    }
}


function ToggleSquare(ev) {
    let board = getLocalBoard()
    let text = $(ev.target).text().trim()
    for (let i = 0; i < board.board.length; i++) {
        if (board.board[i].text === text) {
            if (board.board[i].checked) {
                board.board[i].checked = false
            } else {
                board.board[i].checked = true
            }
            setLocalBoard(board)
            drawBoard()
        }
    }
}



function drawBoard() {
    // We look for element with id "bingo-container" and try to push a bingo board into that element.
    // Hopefully, this should allow for implementation on other sites as well.
    // We do not need to draw footer or header since that
    let board = getLocalBoard()
    let rootElem = $(bingo_parent_element_id)
    rootElem.addClass('row') // Make sure that we have nice things with bootstrap
    table = $('<table>', { 'class': 'bingo-table' })
    let c = 0;
    for (let i = 0; i < board.layout; i++) {
        tableRow = $('<tr>', { 'class': 'bingo-row' })
        for (let i2 = 0; i2 < board.layout; i2++) {
            cell = $('<td>', { 'class': 'bingo-cell', 'click': ToggleSquare }).append($('<div>', { 'class': 'bingo-cell-container' }).append($('<p>', { 'class': 'bingo-text' }).text(board.board[c].text)))
            if (board.board[c].checked) {
                cell.addClass('bingo-highlight')
            }
            tableRow.append(cell)
            c++;
        }
        table.append(tableRow)
    }
    rootElem.empty()
    rootElem.append(table)
    CheckWinConditions()
}


function drawDiag(title, content) {
    content.addClass("bingo-popup-container")
    let diag = $('<div>').attr("id", "dialogue").attr("title", title).html(content);
    $('#bingo-container').append(diag);

    $(function () {
        $("#dialogue").dialog({
            autoOpen: false,
            modal: true,
            width: "40%",
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                    $("#dialogue").remove();
                }
            },
        });
    });
    $("#dialogue").dialog("open");
}

function drawDisclaimer() {
    let title = "Disclaimer";
    let content = $('<div>')
    let content_rows = [
        $('<p>').text("Det här är HUMOR."),
        $('<p>').text("Listan kan med fördel användas av folk som varit på för många årsmöten och är lite trötta på saker som inte fungerar."),
        $('<p>').text("Ett sätt att avreagera sig utan att alla andra får lida för det helt enkelt."),
        $('<p>').text("Användningsområden som ej rekommenderas är att bocka av så mycket som möjligt och sedan använda den för att kritisera mötet."),
        $('<p>').text("Det är inte bara drygt, det är också förbannat opedagogiskt.")
    ]

    content_rows.forEach(function (val) {
        content.append(val)
    })
    //content.append($('<p>').text("Det här är HUMOR.\n\nListan kan med fördel användas av folk som varit på för många årsmöten och är lite trötta på saker som inte fungerar.\n\nEtt sätt att avreagera sig utan att alla andra får lida för det helt enkelt.\n\nAnvändningsområden som ej rekommenderas är att bocka av så mycket som möjligt och sedan använda den för att kritisera mötet. Det är inte bara drygt, det är också förbannat opedagogiskt."));
    drawDiag(title, content);
    window.localStorage.setItem('read_disclaimer', true)
};

function drawAbout() {
    let title = 'Om BingoApp ' + bingo_app_version;
    let content = $('<div>')

    let content_rows = [
        $('<p>').append($('<span>').html('Den här sidan är baserad på en bingobricka framställd av <a href="https://twitter.com/garpebring/status/982699960830431236">Mimmi Garpebring</a> i samband med en gruppchatt mellan Mimmi, Saga Hedberg och Erik Einarsson.')),
        $('<p>').append($('<span>').html('När Mimmi inte hittade någon bra bingogenerator på nätet så fick <a href="https://twitter.com/einarssonerik">Erik</a> den briljanta idén att bygga ihop det själv, glatt påhejad av Mimmi och Saga.')),
        $('<p>').text('Det är resultatet av detta som ni nu bevittnar här.'),
        $('<p>').append($('<span>').html('Feature requests skickas till <a href="mailto:erik@avgåalla.nu">erik@avgåalla.nu</a>, nya saker att lägga in på brickorna genom att besvara <a href="https://twitter.com/garpebring/status/982699960830431236">denna Tweet</a>, buggrapporter hanteras på <a href="https://twitter.com/einarssonerik">Twitter</a>, klagomål på koncept/layout/annat skickas till <a href="mailto:dev/null@avgåalla.nu">dev/null@avgåalla.nu</a> där det kommer hanteras enligt <a href="https://en.wikipedia.org/wiki/Null_device">etablerad praxis</a>.'))
    ]
    content_rows.forEach(function (val) {
        content.append(val)
    })
    drawDiag(title, content);
}

function drawBoardInfo() {
    let title = "Brickor";
    let content = $('<div>').css({ "height": window.innerHeight / 2, overflow: "auto" });

    content.append($('<p>').text("Just nu så finns " + pointList.length + " stycken olika saker som kan hamna på bingobrickan\nFler saker kan tillkomma framöver, samt funktionen att välja vilka som är möjliga att få med i sin bricka."));
    for (let i in pointList) {
        content.append($('<p>').text(pointList[i]));
    }
    drawDiag(title, content);
}

function drawWinMessage() {
    let title = "Grattis/Beklagar sorgen!";
    let content = $('<div>')
    let content_rows = [
        $('<p>').text('Du fick bingo!'),
        $('<p>').text('Vi förstår att möten kan vara dötrist och tråkigt och alldeles underbart, och du har våra sympatier.'),
        $('<p>').text('Med det sagt vill vi påminna om vår disclaimer och råder dig att samla ihop konstruktiv kritik till mötespresidiet.'),
        $('<p>').text('På så sätt blir civilsamhället lite bättre, och du gör alla en stor tjänst. <3')
    ]

    content_rows.forEach(function (val) {
        content.append(val)
    })
    drawDiag(title, content);
};

function drawCookieMessage() {
    var title = "Kakor";
    var content = $('<div>')

    let content_rows = [
        $('<p>').text('Den här sidan sätter inga kakor i din webbläsare!'),
        $('<p>').append($('<span>').html('Däremot sparas data om dina brickor samt huruvida vi visat dig disclaimern eller inte i din webbläsares <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">localstorage</a>.')),
        $('<p>').append($('<span>').html('Om du av någon anledning skulle vara principiellt emot detta så kan du klicka <a href="#" onclick="window.localStorage.clear()">här</a> och stänga webbläsarfliken så kommer all den datan raderas från din webbläsare.')),
        $('<p>').text('Observera att om du tar bort den sparade datan så kommer Disclaimern att visas nästa gång du besöker sidan, och din progress för eventuella brickor kommer vara raderad.')
    ]

    content_rows.forEach(function (val) {
        content.append(val)
    })
    drawDiag(title, content);
}

function drawLicenseMessage() {
    var title = "Licens";
    var content = $('<div>')

    let current_year = new Date().getFullYear()

    let content_rows = [
        $('<p>').text('MIT License'),
        $('<p>').text('Copyright 2018-' + current_year + ' Erik Einarsson'),
        $('<p>').text('Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:'),
        $('<p>').text('The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.'),
        $('<p>').text('THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.')
    ]
    content_rows.forEach(function (val) {
        content.append(val)
    })
    drawDiag(title, content);
}


function BingoApp(input_points=null, seed=null, element=null) {
    let that = this;
    
    if (seed !== null && validateSeed(seed)){
        setGetParameter('board', seed)
    }
    SetupData(input_points || pointList)
    bingo_parent_element_id = element || '#bingo-container'
    bingo_app_version = "2.0.0"
    drawBoard()
    $(document).ready(function () {
        if (window.localStorage.getItem('read_disclaimer') === null) {
            setTimeout(drawDisclaimer, 1000)
        }
    })
    let current_year = new Date().getFullYear()
    console.log('BingoApp ' + bingo_app_version +' loaded. Copyright 2018-' + current_year + ' Erik Einarsson');
}

function generateNewBoard() {
    window.location.replace(document.location.pathname)
}
