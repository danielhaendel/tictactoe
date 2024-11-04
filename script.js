// Spielzustände
let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

let pencilSound = new Audio('sounds/pencil.mp3');
let winSound = new Audio('sounds/win.mp3');
let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    let tableHTML = '<div id="gameContainer" style="position: relative; display: inline-block;">';
    tableHTML += '<table id="gameTable">';

    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let value = fields[index];
            let symbol = '';

            if (value === 'circle') {
                symbol = generateCircleSVG();
            } else if (value === 'cross') {
                symbol = generateCrossSVG();
            }

            tableHTML += `<td id="cell-${index}" onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';
    tableHTML += '</div>';

    document.getElementById('content').innerHTML = tableHTML;
}

function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;
        pencilSound.play();

        let result = checkWin();
        if (result && result !== 'draw') {
            // Gewinner gefunden
            winSound.play();
            disableAllClicks();
            drawWinningLine(result);
            setTimeout(() => {
            }, 100);
        } else if (result === 'draw') {
            // Unentschieden
            setTimeout(() => {
            }, 100);
        } else {
            // Wechsel zum nächsten Spieler
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        }
    }
}

function checkWin() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // Zeilen
        [0,3,6], [1,4,7], [2,5,8], // Spalten
        [0,4,8], [2,4,6]           // Diagonalen
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return pattern; // Gibt das Gewinnmuster zurück
        }
    }

    // Überprüfung auf Unentschieden
    if (fields.every(field => field !== null)) {
        return 'draw';
    }

    return null; // Spiel geht weiter
}

function drawWinningLine(winningPattern) {
    // Erstelle das SVG-Element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";

    // Optional: Mausereignisse ignorieren
    svg.style.pointerEvents = "none";

    // Erstelle die Linie
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "5");
    line.setAttribute("stroke-linecap", "round");

    // Bestimme die Positionen der Linie basierend auf dem Gewinnmuster
    const positions = {
        0: { x: "17%", y: "20%" },
        1: { x: "50%", y: "20%" },
        2: { x: "83.33%", y: "20%" },
        3: { x: "17%", y: "50%" },
        4: { x: "50%", y: "50%" },
        5: { x: "83.33%", y: "50%" },
        6: { x: "17%", y: "79%" },
        7: { x: "50%", y: "79%" },
        8: { x: "83.33%", y: "79%" }
    };

    const start = positions[winningPattern[0]];
    const middle = positions[winningPattern[1]];
    const end = positions[winningPattern[2]];

    // Setze die Start- und Endpunkte der Linie
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);

    // Füge die Linie zum SVG hinzu
    svg.appendChild(line);

    // Füge das SVG zum Spielcontainer hinzu
    document.getElementById('gameContainer').appendChild(svg);

    // Animation der Linie
    const length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
    line.style.animation = 'drawLine 1s forwards';

    // Definiere die Animation in CSS
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes drawLine {
        to {
            stroke-dashoffset: 0;
        }
    }
    `;
    document.head.appendChild(style);
}

function disableAllClicks() {
    for (let i = 0; i < 9; i++) {
        let cell = document.getElementById(`cell-${i}`);
        cell.onclick = null;
    }
}

function generateCircleSVG() {
    const color = '#00B0EF'; // Farbe des Kreises
    const radius = 30; // Radius des Kreises
    const umfang = 2 * Math.PI * radius; // Umfang des Kreises

    const svgCode = `
    <svg width="70" height="70">
        <circle cx="35" cy="35" r="${radius}" stroke="${color}" stroke-width="5" fill="none"
            stroke-dasharray="${umfang}" stroke-dashoffset="${umfang}">
            <animate attributeName="stroke-dashoffset" from="${umfang}" to="0" dur="450ms" fill="freeze"/>
        </circle>
    </svg>
    `;
    return svgCode;
}

function generateCrossSVG() {
    const color = '#FFC000'; // Farbe des Kreuzes
    const lineLength = Math.sqrt(2 * Math.pow(50, 2)); // Länge einer Diagonale (~70.71)

    const svgCode = `
    <svg width="70" height="70">
        <!-- Erste Linie -->
        <line x1="10" y1="10" x2="60" y2="60" stroke="${color}" stroke-width="5" stroke-linecap="round"
              stroke-dasharray="${lineLength}" stroke-dashoffset="${lineLength}">
            <animate attributeName="stroke-dashoffset" from="${lineLength}" to="0" dur="225ms" fill="freeze"/>
        </line>

        <!-- Zweite Linie -->
        <line x1="60" y1="10" x2="10" y2="60" stroke="${color}" stroke-width="5" stroke-linecap="round"
              stroke-dasharray="${lineLength}" stroke-dashoffset="${lineLength}">
            <animate attributeName="stroke-dashoffset" from="${lineLength}" to="0" dur="225ms" begin="225ms" fill="freeze"/>
        </line>
    </svg>
    `;
    return svgCode;
}

// Initialisierung des Spiels
init();
