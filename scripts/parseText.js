// scripts/parseText.js
const fs = require('fs');
const pdf = require('pdf-parse');
const TabuaDia = require('./TabuaDia.js');

// Mapeamento de dias da semana, normalizando acentos
const diasMap = {
  "SEG": "SEG", "TER": "TER", "QUA": "QUA",
  "QUI": "QUI", "SEX": "SEX", "SAB": "SAB", "SÁB": "SAB",
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
  text = text.replace(/\s+/g, " ");

  // Extrai o ano (primeiro número de 4 dígitos que aparecer)
  const anoMatch = text.match(/\b(\d{4})\b/);
  if (anoMatch) year = anoMatch[1];

  // Quebra o texto em tokens por espaço
  const tokens = text.split(" ");

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].toUpperCase();

    // Identifica dia da semana
    if (diaNome(token) && i >= 1) {
      const dayNum = tokens[i - 1].padStart(2, "0");
      const temp_day = new TabuaDia();
      temp_day.dia = diasMap[token];
      temp_day.data = `${dayNum}/${month.toString().padStart(2, "0")}/${year}`;

      // Ajusta mês se o dia atual for menor que o anterior
      if (arrayDay.length) {
        const priorday = arrayDay[arrayDay.length - 1].data;
        if (parseInt(dayNum) < parseInt(priorday.substr(0, 2))) month++;
      }

      // Extrai até 4 pares hora/altura
      let j = i + 1;
      for (let k = 1; k <= 4; k++) {
        if (j + 1 >= tokens.length) break;
        temp_day[`hora${k}`] = tokens[j].replace(/\D/g, "").padStart(4, "0");
        temp_day[`altura${k}`] = tokens[j + 1].replace(",", ".");
        j += 2;
      }

      arrayDay.push(temp_day);
    }
  }

  return arrayDay;
}

async function processarTabelaMare(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return parseText(data.text);
}

module.exports = { processarTabelaMare };
