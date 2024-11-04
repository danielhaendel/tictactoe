let fields = [
    'cross',  null,    'circle',
    null,     'cross', null,
    'circle', null,    'cross'
];

let pencilSound = new Audio('sounds/pencil.mp3');
let winSound = new Audio('sounds/win.mp3');

function init() {
    render();
}

function render() {
    let tableHTML = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let value = fields[index];
            let symbol = '';
            let className = '';

            if (value === 'circle') {
                symbol = generateCircleSVG();
                className = 'circle';
            } else if (value === 'cross') {
                symbol = generateCrossSVG();
                className = 'cross';
            }

            tableHTML += `<td class="${className}" onclick="handleClick(${index})">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    document.getElementById('content').innerHTML = tableHTML;
}


function handleClick(index) {
    // Logik zum Verarbeiten des Klicks auf Feld mit dem gegebenen Index
}


function generateCircleSVG() {
    const color = '#00B0EF'; // Farbe des Kreises
    const radius = 30; // Radius des Kreises
    const umfang = 2 * Math.PI * radius; // Umfang des Kreises
    pencilSound.play();
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
    pencilSound.play();
    const svgCode = `
<svg width="70" height="70">
    <!-- Erste Linie -->
    <line x1="10" y1="10" x2="60" y2="60" stroke="${color}" stroke-width="5" stroke-linecap="round"
          stroke-dasharray="${lineLength}" stroke-dashoffset="${lineLength}">
        <animate attributeName="stroke-dashoffset" from="${lineLength}" to="0" dur="225ms" fill="freeze"/>
    </line>

    <!-- Zweite Linie -->
    <line x1="60" y1="10" x2="10" y2="60" stroke="#FFC000" stroke-width="5" stroke-linecap="round"
          stroke-dasharray="${lineLength}" stroke-dashoffset="${lineLength}">
        <animate attributeName="stroke-dashoffset" from="${lineLength}" to="0" dur="225ms" begin="225ms" fill="freeze"/>
    </line>
</svg>
    `;
    return svgCode;
}
