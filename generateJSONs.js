const fs = require('fs');
const path = require('path');
const { processarTabelaMare } = require('./scripts/parseText.js');
const { arrLocations } = require('./scripts/posicaoPdf.js');

async function gerarJSONs() {
  const outputDir = path.join(__dirname, 'app/previsao/jsons');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('Pasta criada em:', outputDir);
  }

  for (const loc of arrLocations) {
    if (!loc.url) continue;

    const pdfPath = path.join(__dirname, loc.url);

    if (!fs.existsSync(pdfPath)) {
      console.log('PDF não encontrado:', pdfPath);
      continue;
    }

    const dados = await processarTabelaMare(pdfPath);

    const jsonName = path.basename(loc.url, '.pdf') + '.json';
    const jsonPath = path.join(outputDir, jsonName);

    fs.writeFileSync(jsonPath, JSON.stringify(dados, null, 2));
    console.log('JSON gerado:', jsonPath);
  }
}

gerarJSONs();
