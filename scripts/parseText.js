const fs = require('fs');
const pdf = require('pdf-parse');
const TabuaDia = require('./TabuaDia.js');

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

  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  text = text.replace(/\s+/g, " ");

  const anoMatch = text.match(/\b(\d{4})\b/);
  if (anoMatch) year = anoMatch[1];

  const tokens = text.split(" ");

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].toUpperCase();

    if (diaNome(token) && i >= 1) {
      const dayNum = tokens[i - 1].padStart(2, "0");
      const temp_day = new TabuaDia();
      temp_day.dia = diasMap[token];
      temp_day.data = `${dayNum}/${month.toString().padStart(2, "0")}/${year}`;

      if (arrayDay.length) {
        const priorday = arrayDay[arrayDay.length - 1].data;
        if (parseInt(dayNum) < parseInt(priorday.substr(0, 2))) month++;
      }

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

async function processarTabelaMare(pdfPath) {
  if (!fs.existsSync(pdfPath)) {
    console.warn('[processarTabelaMare] PDF não encontrado:', pdfPath);
    return [];
  }

  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);
    return parseText(pdfData.text);
  } catch (err) {
    console.error('[processarTabelaMare] Erro ao processar PDF:', pdfPath, err);
    return [];
  }
}

module.exports = { processarTabelaMare };
