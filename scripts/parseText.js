// scripts/parseText.js
const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const TabuaDia = require('./TabuaDia.js');

// Mapeamento de dias da semana, normalizando acentos
const diasMap = {
  "SEG": "SEG", "TER": "TER", "QUA": "QUA",
  "QUI": "QUI", "SEX": "SEX", "SÁB": "SAB", "SAB": "SAB",
  "DOM": "DOM"
};

function diaNome(text) {
  return diasMap[text] !== undefined;
}

function parseText(text) {
  const arrayDay = [];
  let month = 1;
  let year = null;

  // Normaliza acentos e múltiplos espaços
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  text = text.replace(/\s+/g, ' ');

  // Extrai o ano: assume o primeiro número com 4 dígitos
  const anoMatch = text.match(/\b(\d{4})\b/);
  if (anoMatch) year = anoMatch[1];

  // Quebra o texto em tokens por espaço
  const tokens = text.split(' ');

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Identifica dia da semana
    if (diaNome(token) && i >= 1) {
      const dayNum = tokens[i-1].padStart(2, '0'); // número do dia anterior
      const curi = i;

      const temp_day = new TabuaDia();
      temp_day.dia = diasMap[token];
      temp_day.data = `${dayNum}/${month.toString().padStart(2,'0')}/${year}`;

      // Ajusta mês se o dia for menor que o anterior
      if (arrayDay.length) {
        const priorday = arrayDay[arrayDay.length-1].data;
        if (parseInt(dayNum) < parseInt(priorday.substr(0,2))) month++;
      }

      // Extrai até 4 pares hora/altura
      let j = i + 1;
      for (let k = 1; k <= 4; k++) {
        if (j+1 >= tokens.length) break;
        temp_day[`hora${k}`] = tokens[j].replace(/\D/g,'').padStart(4,'0'); // formata hora tipo 0614
        temp_day[`altura${k}`] = tokens[j+1].replace(',', '.'); // altura tipo 0.28
        j += 2;
      }

      arrayDay.push(temp_day);
    }
  }

  return arrayDay;
}

async function processarTabelaMare(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + ' ';
  }

  return parseText(text);
}

module.exports = { processarTabelaMare };
