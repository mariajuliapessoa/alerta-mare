const fs = require('fs');
const path = require('path');
const { processarTabelaMare } = require('./scripts/parseText.js');
const { arrLocations } = require('./scripts/posicaoPdf.js');

async function gerarJSONs() {
  // Caminho da nova pasta dentro do projeto Next.js
  const outputDir = path.join(__dirname, 'app/previsao/jsons');

  // Cria a pasta se não existir
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

    // Define caminho do JSON dentro da nova pasta
    const jsonName = path.basename(loc.url, '.pdf') + '.json';
    const jsonPath = path.join(outputDir, jsonName);

    // Salva JSON
    fs.writeFileSync(jsonPath, JSON.stringify(dados, null, 2));
    console.log('JSON gerado:', jsonPath);
  }
}

gerarJSONs();
